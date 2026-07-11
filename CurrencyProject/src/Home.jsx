import React from "react";
import { Link } from "react-router";

export const Home = () => {
    return (
        <div>
            <h1>Benvenuto su Currency Monitor</h1>
            <p>
                Su questa pagina puoi vedere l'andamento delle monete a livello mondiale 
                e vederne i propri exchange rates.
            </p>
            <p>
                Puoi accedere a queste informazioni sui link della nav bar 
                oppure <Link className="link" to="/currency">clicca qui per andare a vedere gli andamenti</Link> oppure <Link className="link" to="/exchange">qui per gli scambi monetari</Link>
            </p>
        </div>
    )
}