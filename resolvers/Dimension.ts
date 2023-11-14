import mongoose from "npm:mongoose@7.6.3";
import express, { Request, Response } from "npm:express@4.18.2";
import { DimensionesModel, PlanetasModel, PersonasModel } from '../Tardis.ts'



const postDimension = async (req: Request, res: Response) => {
  try {
    const { planetas } = req.body;

    // Verificar si se proporcionaron todos los datos necesarios
    if (!planetas) {
      return res.status(400).send("Error: Missing data");
    }

    // Obtener información de cada planeta
    const array = await Promise.all(planetas.map(async (id: string) => {
      try {
        const planet = await PlanetasModel.findById(id).exec();

        if (planet) {
          return { id: planet._id.toString() };
        } else {
          return res.status(404).send("Error: Planet not found");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }));

    // Crear una nueva dimensión con planetas asociados
    const newDim = new DimensionesModel({ id_plan: planetas });
    await newDim.save();
    // Enviar la información de la nueva dimensión
    return res.status(200).send({
      id: newDim._id.toString(),
      id_plan: newDim.id_plan
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dimension = await DimensionesModel.findById(id).populate({path:"id_plan",populate:("id_per")}).exec();

    if (!dimension) {
      return res.status(404).send("Error: Dimension not found");
    }

    
    return res.status(200).send({ 
      id: dimension._id.toString(),
      planetas: dimension.id_plan.map(planeta => { 
        return {
          id: planeta._id.toString(),
          persona: planeta.id_per.map(personas => {
            return {
              id: personas._id.toString(),
              nombre: personas.nombre,
            }
          })
        }
      })
    });

    } catch (error) {

        res.status(500).send(error.message); // Si hay un error, devuelvo un error 500

        return; // Corto la ejecucion de la funcion
    }
};


// Función para actualizar una dimensión existente con nuevos planetas asociados
const putDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { planetas } = req.body;

    // Verificar si se proporcionaron los datos necesarios
    if (!planetas) {
      return res.status(400).send("Error: Planets are required");
    }

    // Obtener información de cada planeta en paralelo
    const array = await Promise.all(planetas.map(async (id: string) => {
      try {
      const planet = await PlanetasModel.findById(id).exec();
          // Verificar si el planeta existe
          if (planet) {
            return { id: planet._id.toString() };
          } else {
            return res.status(404).send("Error: Planet not found");
          }
        
      } catch (error) {
        throw new Error(error.message);
      }
    }));

    // Actualizar la dimensión con los nuevos planetas asociados
    const updatedDimension = await DimensionesModel.findByIdAndUpdate(id,{ id_plan: planetas },{ new: true }).exec();
    // Verificar si la dimensión fue actualizada correctamente
    if (!updatedDimension) {
      return res.status(404).send("Error: Dimension not found");
    }
    // Enviar respuesta con la información actualizada
    return res.status(200).send({
      id: updatedDimension._id.toString(),
      id_plan: updatedDimension.id_plan
    });
  } catch (error) {
    //  errores 
    return res.status(500).send(error.message);
  }
};

// Función para eliminar una dimensión y sus planetas y personas asociadas
const deleteDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar la dimensión por su ID
    const dimension = await DimensionesModel.findByIdAndDelete(id).exec();

       // Verificar si la dimensión tiene planetas asociados
    if (dimension.id_plan !== null) {
      const planetasIds = dimension.id_plan;

      // Eliminar los planetas y personas asociadas a la dimensión, hecho con ayuda de compañeros
      await Promise.all(planetasIds.map(async (planetaId) => {
        const planeta = await PlanetasModel.findByIdAndDelete(planetaId).exec();

        if (planeta && planeta.id_per !== null) {
          const personasIds = planeta.id_per;
          await Promise.all(personasIds.map(async (personaId) => {
            await PersonasModel.findByIdAndDelete(personaId).exec();
          }));
        }
      }));
    }

    // Enviar respuesta indicando que la dimensión y sus asociados fueron eliminados
    return res.status(200).send(`Dimension with ID ${id} and associated planets and personas deleted`);
  } catch (error) {
    //  errores 
    return res.status(500).send(error.message);
  }
};

export { postDimension, getDimension, putDimension, deleteDimension };
