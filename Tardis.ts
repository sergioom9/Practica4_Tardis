import mongoose from "npm:mongoose@7.6.3";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;




const DimensionesSchema=new Schema({
    id_plan: [{ type: Schema.Types.ObjectId, ref: "planetas" }]
});
//EXPORTAMOS DIMENSION QUE CONTIENE UN ARRAY CON IDS DE PLANETAS
export type DimensionesModelType={
   id:string,
   id_plan:PlanetasModelType[]
}

const PlanetasSchema=new Schema({
    id_per: [{ type: Schema.Types.ObjectId, ref: "personas" }]
});
//EXPORTAMIS PLANETAS QUE CONTIENE UN ARRAY DE IDS DE PERSONAS
export type PlanetasModelType={
   id:string,
   id_per:PersonasModelType[];
}


const PersonasSchema=new Schema({
    nombre: {type:String,required:true}
});
//TIPO PERSONA QUE CONTIENE NOMBRE DE LA PERSONA
export type PersonasModelType={
    nombre:string,
    id:string
}



const TardisSchema=new Schema({
  camuflaje: {type:String,required:true},
  numero_regeneracion: {type:Number,required:true},
  ano: {type:Number,required:true},
  id_dim:[{ type: Schema.Types.ObjectId, ref: "dimensiones" }]
});
//POR ULTIMO EL TIPO TARDIS CON EL RESTO DE CARACTERISTICAS PEDIDAS
export type TardisModelType={
  camuflaje: string;
  numero_regeneracion: number;
  ano: number;
  id_dim: DimensionesModelType[];
}



export const DimensionesModel = mongoose.model<DimensionesModelType>("dimensiones",DimensionesSchema);
export const TardisModel = mongoose.model<TardisModelType>("tardis",TardisSchema);
export const PersonasModel = mongoose.model<PersonasModelType>("personas",PersonasSchema);
export const PlanetasModel = mongoose.model<PlanetasModelType>("planetas",PlanetasSchema);