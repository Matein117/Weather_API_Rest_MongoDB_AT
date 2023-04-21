export function removeNullFields (model) { 
    const modelCopy = Object.assign({}, model)

    for (const key in modelCopy) {
        if (modelCopy[key] == null || modelCopy[key] == undefined) {
            delete modelCopy[key]        
        }
    }

    return modelCopy
}