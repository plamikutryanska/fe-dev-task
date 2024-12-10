import {CombinedData, TableData} from '../types/carTypes'

export const handleTableData = (data: CombinedData[] ) => {
  return data.flatMap(car => {
    
     return car.models.flatMap((model): TableData[]  => {
      if(model.modifications.length === 0) {
        return [{
          id: car.brand.id,
          brand: car.brand.name,
          model: model.name,
          modification: null,
          coupe: null,
          horsepower: null,
          weight: null
        }];
      } else {
        return model.modifications.map((modelMod): TableData => {
          return {
            id: car.brand.id,
            brand: car.brand.name,
            model: model.name,
            modification: modelMod.name,
            coupe: modelMod.coupe,
            horsepower: modelMod.horsePower,
            weight: modelMod.weight
          }
        })
      }
    })
  })
}
