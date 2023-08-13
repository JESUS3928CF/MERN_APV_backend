import  express  from "express";
import connectDB from "./config/db.js"; 
import dotenv from "dotenv";
import vetRoutes from "./routes/vetRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
//! Importando el cors 
import cors from "cors"; 

const app = express();
app.use(express.json()); 

dotenv.config();
connectDB();

/// Dominios permitidos
const domainsAllowed = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if(domainsAllowed.indexOf(origin) !== -1){
            /// El Origen del Request esta permitido
            callback(null, true)
        } else {
            callback( new Error(" No permitido por CORS"))
        }
    }
}

app.use(cors(corsOptions));
// app.use(cors());

const port = process.env.PORT || 4000;

app.use("/api/vets", vetRoutes);
app.use('/api/patients', patientRoutes);



app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
});