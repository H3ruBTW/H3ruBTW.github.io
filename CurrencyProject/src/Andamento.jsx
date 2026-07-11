import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { popularCurrencies, otherCurrencies } from "./currency-library";
import { useThemeContext } from "./ThemeContext";

export const Andamento = () => {
    const [valuta, setValuta] = useState("EUR");
    const [tempo, setTempo] = useState("7gg");
    const [quote, setQuote] = useState("USD");
    const [trend, setTrend] = useState(null);
    const [loading, setLoading] = useState(false);
    const { theme } = useThemeContext();

    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    const cellulare = window.matchMedia("(max-width: 768px)").matches;

    const renderTable = async () => {

        setLoading(true);

        let labels = [];
        let dataset = [];

        const json = await getValuta();

        json.forEach(({ date, rate }) => {
            labels.push(date);
            dataset.push(rate);
        });

        const primoValore = dataset[0];
        const ultimoValore = dataset[dataset.length - 1];

        if (primoValore !== undefined && ultimoValore !== undefined) {
            const differenza = ultimoValore - primoValore;
            const percentuale = primoValore !== 0
                ? (differenza / primoValore) * 100
                : 0;

            setTrend({
                primoValore,
                ultimoValore,
                differenza,
                percentuale,
                positivo: differenza >= 0,
            });
        }

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: `${valuta}/${quote}`,
                        data: dataset,
                        borderWidth: 2,
                        pointRadius: cellulare
                            ? (tempo === "28gg" ? 4 : tempo === "7gg" ? 9 : 5)
                            : (tempo === "28gg" ? 5 : tempo === "7gg" ? 9 : 6),
                        pointHoverRadius: cellulare ? 7 : 10,
                        pointBorderWidth: 2,
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#111111",
                        segment: {
                            borderColor: (ctx) => {
                                const y0 = ctx.p0.parsed.y;
                                const y1 = ctx.p1.parsed.y;
                                return y1 >= y0 ? "#16a34a" : "#dc2626";
                            },
                        },
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 100,
                animation: {
                    duration: 1000,
                    easing: "easeOutQuart",
                },
                scales: {
                    x: {
                        grid: {
                            color: theme === "dark"
                                ? "rgba(255, 255, 255, 0.14)"
                                : "rgba(0, 0, 0, 0.08)",
                        },
                        ticks: {
                            color: theme === "dark" ? "#F6F4EE" : "#3F5A45",
                        },
                    },
                    y: {
                        grid: {
                            color: theme === "dark"
                                ? "rgba(255, 255, 255, 0.14)"
                                : "rgba(0, 0, 0, 0.08)",
                        },
                        ticks: {
                            color: theme === "dark" ? "#F6F4EE" : "#3F5A45",
                        },
                    },
                }
            }
        });

        setTimeout(() => {
            if (chartRef.current) {
                chartRef.current.resize();
                chartRef.current.update();
            }

            setLoading(false);
        }, 100);
    };

    const getValuta = async () => {
        let url = `https://api.frankfurter.dev/v2/rates?base=${valuta}&quotes=${quote}`;

        switch (tempo) {
            case "7gg": {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 7);
                const formatted = fromDate.toISOString().split("T")[0];
                url += `&from=${formatted}`;
                break;
            }

            case "28gg": {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 28);
                const formatted = fromDate.toISOString().split("T")[0];
                url += `&from=${formatted}`;
                break;
            }

            case "3m": {
                const fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() - 3);
                const formatted = fromDate.toISOString().split("T")[0];
                url += `&from=${formatted}&group=week`;
                break;
            }

            case "1a": {
                const fromDate = new Date();
                fromDate.setFullYear(fromDate.getFullYear() - 1);
                const formatted = fromDate.toISOString().split("T")[0];
                url += `&from=${formatted}&group=month`;
                break;
            }

            default:
                break;
        }

        const response = await fetch(url);
        const json = await response.json();
        return json;
    };

    useEffect(() => {
        renderTable();

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [valuta, quote, tempo, theme]);

    // FIX FUNZIONAMENTO DELL'ANIMAZIONE DEL CHART DA CELLULARE
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);

    const onChange = (e) => {
        setValuta(e.target.value);
    };

    return (
        <>
            <h1>Andamento {valuta}</h1>

            <label className="label">
                Valuta
                <br />
                <select className="select" onChange={onChange}>
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

            <div className="container-options">
                <div>
                    <button className={tempo === "7gg" ? "active" : ""} onClick={() => setTempo("7gg")}>Ultimi 7gg</button>
                    <button className={tempo === "28gg" ? "active" : ""} onClick={() => setTempo("28gg")}>Ultimi 28gg</button>
                    <button className={tempo === "3m" ? "active" : ""} onClick={() => setTempo("3m")}>Ultimi 3m</button>
                    <button className={tempo === "1a" ? "active" : ""} onClick={() => setTempo("1a")}>Ultimo 1a</button>
                </div>

                <div>
                    <label className="label">
                        In base a
                        <br />
                        <button className={quote === "EUR" ? "active" : ""}onClick={() => setQuote("EUR")}
                        >EUR</button>
                        <button className={quote === "USD" ? "active" : ""} onClick={() => setQuote("USD")}>USD</button>
                    </label>
                </div>
            </div>

            {trend && (
                <div className={`andamento-trend ${trend.positivo ? "up" : "down"}`}>
                    <p className="andamento-trend-title">
                        {trend.positivo ? "Trend in crescita" : "Trend in calo"}
                    </p>

                    <p className="andamento-trend-value">
                        {trend.differenza > 0 ? "+" : ""}
                        {trend.differenza.toFixed(4)} ({trend.percentuale.toFixed(2)}%)
                    </p>

                    <p className="andamento-trend-meta">
                        Da {trend.primoValore.toFixed(4)} a {trend.ultimoValore.toFixed(4)}
                    </p>
                </div>
            )}

            <div className={`andamento-chart-wrapper ${loading ? "is-loading" : ""}`}>
                {loading && (
                    <div className="andamento-loader">
                        <span className="sr-only">Caricamento grafico...</span>
                    </div>
                )}

                <canvas ref={canvasRef} id="canvas" className="andamento-canvas" role="img">
                    <p>Rendering non effettuato</p>
                </canvas>
            </div>
        </>
    );
};