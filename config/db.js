import mongoose from "mongoose";

const connectDB = async () => {
    try {

        const db = await mongoose.connect( 
            process.env.MONGO_URI, { //! Utilizando las variables de entorno donde sea necesario 
                //- esto lo requiere mongoose
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`MongoDB conectado en: ${url}`);
        
    } catch (error) {
        /// Para obtener información más detallas acerca del error
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}


export default connectDB;