import React, { useEffect, useState } from "react";
import { popularCurrencies, otherCurrencies } from "./currency-library";

export const Scambio = () => {
    const [valuta1, setValuta1] = useState(() => {
        const saved = localStorage.getItem("pref");

        try {
            const parsed = saved ? JSON.parse(saved) : [];
            return parsed[0]?.base ?? "EUR";
        } catch {
            return "EUR";
        }
    })
    const [valuta2, setValuta2] = useState(() => {
        const saved = localStorage.getItem("pref");

        try {
            const parsed = saved ? JSON.parse(saved) : [];
            return parsed[0]?.quote ?? "USD";
        } catch {
            return "USD";
        }
    })
    const [start, setStart] = useState(1)
    const [finish, setFinish] = useState(0)
    const [trends, setTrends] = useState({
        oggi: {
            rate: 0,
            value: 0,
            trend: "0%"
        },
        ieri: {
            rate: 0,
            value: 0,
            trend: "0%"
        },
        gg: {
            rate: 0,
            value: 0,
            trend: "0%"
        },
        s: {
            rate: 0,
            value: 0,
            trend: "0%"
        },
        m: {
            rate: 0,
            value: 0,
            trend: "0%"
        },
    })
    const [loading, setLoading] = useState(false);
    const [preferiti, setPreferiti] = useState(() => {
        const saved = localStorage.getItem("pref");
        return saved ? JSON.parse(saved) : [];
    });
    const [preferitiAperto, setPreferitiAperto] = useState(false)
    const isFavorite = preferiti.some(
        (e) => e.base === valuta1 && e.quote === valuta2
    );

    
    const onChange1 = (e) => {
        setValuta1(e.target.value);
    }

    const onChange2 = (e) => {
        setValuta2(e.target.value);
    }

    const swap = () => {
        const valutaTemp = valuta2
        setValuta2(valuta1)
        setValuta1(valutaTemp)
    }

    useEffect(() => {
        setData();
    }, [valuta1, valuta2]);

    const setData = async () => {
        setLoading(true);

        try {
            const dateToday = new Date();

            const todayDate = new Date(dateToday);
            const yestDate = new Date(dateToday);
            const ggDate = new Date(dateToday);
            const ssDate = new Date(dateToday);
            const mmDate = new Date(dateToday);

            yestDate.setDate(yestDate.getDate() - 1);
            ggDate.setDate(ggDate.getDate() - 3);
            ssDate.setDate(ssDate.getDate() - 7);
            mmDate.setMonth(mmDate.getMonth() - 1);

            const today = await getJsonFromDate(formatDate(todayDate));
            const yest = await getJsonFromDate(formatDate(yestDate));
            const gg = await getJsonFromDate(formatDate(ggDate));
            const ss = await getJsonFromDate(formatDate(ssDate));
            const mm = await getJsonFromDate(formatDate(mmDate));

            const amount = Number(start) || 0;

            const trend_obj = {
                oggi: {
                    rate: today.rate,
                    value: (amount * today.rate).toFixed(4),
                    trend: "0%"
                },
                ieri: {
                    rate: yest.rate,
                    value: (amount * yest.rate).toFixed(4),
                    trend: getPercentuale(yest.rate, today.rate)
                },
                gg: {
                    rate: gg.rate,
                    value: (amount * gg.rate).toFixed(4),
                    trend: getPercentuale(gg.rate, today.rate)
                },
                s: {
                    rate: ss.rate,
                    value: (amount * ss.rate).toFixed(4),
                    trend: getPercentuale(ss.rate, today.rate)
                },
                m: {
                    rate: mm.rate,
                    value: (amount * mm.rate).toFixed(4),
                    trend: getPercentuale(mm.rate, today.rate)
                },
            };

            setFinish((amount * today.rate).toFixed(4));
            setTrends(trend_obj);
        } catch (error) {
            console.error("Errore nel recupero dei tassi:", error);
        } finally {
            setLoading(false);
        }
    };

    const getJsonFromDate = async (data) => {
        const params = new URLSearchParams({
            base: valuta1,
            quotes: valuta2,
            date: data
        });

        const url = `https://api.frankfurter.dev/v2/rates?${params.toString()}`;

        const response = await fetch(url);
        const json = await response.json();

        return json[0];
    }

    const getPercentuale = (prima, oggi) => {
        if (start === null || Number(start) === 0) {
            return "0.0000%" 
        }

        if (prima !== null && oggi !== null) {
            const differenza = oggi - prima;
            const percentuale = (prima !== 0)
                ? (differenza / prima) * 100
                : 0;

            return percentuale.toFixed(4) + "%";
        }

        return "No data";
    }


    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    const handleStartChange = (e) => {
        let value = e.target.value;

        value = value.replace(/,/g, ".");
        value = value.replace(/[^0-9.]/g, "");

        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }

        if (value.includes(".")) {
            const [intPart, decPart] = value.split(".");
            value = `${intPart}.${decPart.slice(0, 2)}`;
        }

        setStart(value);
    };

    useEffect(() => {
        updateCalculatedValues()
    }, [start])

    const updateCalculatedValues = () => {
        const amount = Number(start);

        if (!amount) {
            setFinish(0);
            setTrends(prev => ({
                ...prev,
                oggi: { ...prev.oggi, value: 0 },
                ieri: { ...prev.ieri, value: 0 },
                gg: { ...prev.gg, value: 0 },
                s: { ...prev.s, value: 0 },
                m: { ...prev.m, value: 0 },
            }));
            return;
        }

        setFinish((amount * trends.oggi.rate).toFixed(4));

        setTrends(prev => ({
            ...prev,
            oggi: {
                ...prev.oggi,
                value: (amount * prev.oggi.rate).toFixed(4),
            },
            ieri: {
                ...prev.ieri,
                value: (amount * prev.ieri.rate).toFixed(4),
            },
            gg: {
                ...prev.gg,
                value: (amount * prev.gg.rate).toFixed(4),
            },
            s: {
                ...prev.s,
                value: (amount * prev.s.rate).toFixed(4),
            },
            m: {
                ...prev.m,
                value: (amount * prev.m.rate).toFixed(4),
            },
        }));
    };

    const addremFav = () => {
        let updatedPreferiti;

        if (isFavorite) {
            updatedPreferiti = preferiti.filter(
                (e) => !(e.base === valuta1 && e.quote === valuta2)
            );
        } else {
            updatedPreferiti = [
                {
                    base: valuta1,
                    quote: valuta2,
                },
                ...preferiti,
            ];
        }

        setPreferiti(updatedPreferiti);
    };

    useEffect(() => {
        localStorage.setItem("pref", JSON.stringify(preferiti));
    }, [preferiti]);

    return (
        <>
            <h1>Exchange rate {valuta1} ➩ {valuta2}</h1>

            <div className="favourite_div">
                <button onClick={addremFav}>{isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}</button>
                <button onClick={() => setPreferitiAperto(true)}>Lista dei preferiti ({preferiti.length})</button>
            </div>

            {
                preferitiAperto && (
                    <div className="mostra-pref-div">
                        <div className="mostra-pref-header">
                            <h3>I tuoi preferiti</h3>
                            <button
                                className="close-pref-btn"
                                onClick={() => setPreferitiAperto(false)}
                                type="button"
                            >
                                ✕
                            </button>
                        </div>

                        {
                            preferiti.map((e, index) => {
                                let val1 = popularCurrencies.find((c) => c.value === e.base);
                                let val2 = popularCurrencies.find((c) => c.value === e.quote);

                                if (val1 === undefined) {
                                    val1 = otherCurrencies.find((c) => c.value === e.base);
                                }

                                if (val2 === undefined) {
                                    val2 = otherCurrencies.find((c) => c.value === e.quote);
                                }

                                if (!val1 || !val2) {
                                    return null;
                                }

                                const text = val1.label + " ➩ " + val2.label;

                                return (
                                    <button
                                        key={`${e.base}-${e.quote}-${index}`}
                                        className="scelta-preferiti"
                                        onClick={() => {
                                            setValuta1(val1.value);
                                            setValuta2(val2.value);
                                            setPreferitiAperto(false);
                                        }}
                                    >
                                        {text}
                                    </button>
                                );
                            })
                        }
                    </div>
                )
            }

            <div className="scambio-valute">
                <label className="label">
                    Valuta
                    <br />
                    <select className="select" value={valuta1} onChange={onChange1}>
                        <option disabled>Più popolari</option>
    
                        {popularCurrencies.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
    
                        <option disabled>Altre valute</option>
    
                        {otherCurrencies.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
                    
                    <button className="swap-curr-btn" onClick={swap}></button>

                <label className="label">
                    Valuta
                    <br />
                    <select className="select" value={valuta2} onChange={onChange2}>
                        <option disabled>Più popolari</option>
    
                        {popularCurrencies.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
    
                        <option disabled>Altre valute</option>
    
                        {otherCurrencies.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="exchange-div">
                <input type="text" className="number-input" value={start} onChange={(e) => handleStartChange(e)}
                min="0"/>
                <input type="text" className="number-input exchange"  value={finish} readOnly />
            </div>
            <div className={`exchange-values-div ${loading ? "is-loading" : ""}`}>
                {loading && (
                    <div className="andamento-loader">
                        <span className="sr-only">Caricamento dati cambio...</span>
                    </div>
                )}

                <h2>Rispetto a:</h2>
                <div className="div-andamenti">
                    <div className="stats-base">
                        <p><b>Ieri</b></p>
                        <p>{trends.ieri.value}</p>
                        <p
                            className={
                                parseFloat(trends.ieri.trend) > 0
                                    ? "up"
                                    : parseFloat(trends.ieri.trend) < 0
                                    ? "down"
                                    : "noChange"
                            }
                        >
                            {trends.ieri.trend}
                        </p>
                    </div>

                    <div className="stats-base">
                        <p><b>3 giorni fa</b></p>
                        <p>{trends.gg.value}</p>
                        <p
                            className={
                                parseFloat(trends.gg.trend) > 0
                                    ? "up"
                                    : parseFloat(trends.gg.trend) < 0
                                    ? "down"
                                    : "noChange"
                            }
                        >
                            {trends.gg.trend}
                        </p>
                    </div>

                    <div className="stats-base">
                        <p><b>Settimana scorsa</b></p>
                        <p>{trends.s.value}</p>
                        <p
                            className={
                                parseFloat(trends.s.trend) > 0
                                    ? "up"
                                    : parseFloat(trends.s.trend) < 0
                                    ? "down"
                                    : "noChange"
                            }
                        >
                            {trends.s.trend}
                        </p>
                    </div>

                    <div className="stats-base">
                        <p><b>Mese scorso</b></p>
                        <p>{trends.m.value}</p>
                        <p
                            className={
                                parseFloat(trends.m.trend) > 0
                                    ? "up"
                                    : parseFloat(trends.m.trend) < 0
                                    ? "down"
                                    : "noChange"
                            }
                        >
                            {trends.m.trend}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}