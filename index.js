import { writeFile, constants, access, readFileSync, rm } from 'node:fs'
import { Buffer } from 'node:buffer';
import prompt from 'prompt-sync'



const promptFunction = prompt();

const fileController = () => {
    let action;
    do {
        action = promptFunction('Qué acción desea realizar? (Creación: C, Lectura: R, Modificación: U, Eliminación: D, Salir: Q): ').toLowerCase()
    } while (!(action === 'c' || action === 'r' || action === 'u' || action === 'd' || action === 'q'));

    console.log(action)
    if(action === 'q') {
        console.log('Programa finalizado');
        return
    }

    let actionName;
    switch (action) {
        case 'c':
            actionName = 'crear'
            break;
        case 'r':
            actionName = 'leer'
            break;
        case 'u':
            actionName = 'modificar'
            break;
        case 'd':
            actionName = 'eliminar'
            break;

        default:
            break;
    }

    let fileName;
    const regex = new RegExp(/[A-Za-z0-9]{1,20}\.[a-z]{3,6}/)

    do {
        fileName = promptFunction(`Por favor ingrese el nombre del archivo que desea ${actionName}: `)
        if(!regex.test(fileName)) console.log('El nombre del archivo no pertenece a un formato reconocido')
    } while (!regex.test(fileName))
        const dirName = `./files/${fileName}`
        console.log(dirName)
    switch (action) {
        case 'c':
            const content = promptFunction('Por favor ingrese el contenido del archivo que desea crear: ');
            const buffer = new Uint8Array(Buffer.from(content))
            writeFile(
                dirName,
                buffer, 
                error => {
                    if(error) {
                        console.log('Ha ocurrido un error al crear el archivo');
                    } else {
                        console.log('El archivo ha sido creado correctamente');
                    }
                }
            )
            break;
        case 'r':
            access(
                    dirName, 
                    constants.R_OK,
                    error => console.log(`${error ? 'No se pudo leer el archivo' : readFileSync(dirName).toString()}`)
                )
            break;
        case 'u':
                access(
                    dirName,
                    constants.R_OK | constants.W_OK,
                    error => {
                        if (error) {
                            console.log('El archivo no se puede leer y/o escribir');
                        } else {
                            const content = promptFunction('Por favor ingrese el nuevo contenido del archivo: ');
                            const buffer = new Uint8Array(Buffer.from(content));
                            writeFile(
                                dirName,
                                buffer,
                                error => {
                                    if(error) {
                                        console.log('Ha ocurrido un error al modificar el archivo');
                                    } else {
                                        console.log('El archivo ha sido modificado correctamente');
                                    }
                                }
                            )
                        }
                    }
                )
            break;
        case 'd':
                rm(
                    dirName,
                    error => {
                        if(error) {
                            console.log('No se ha podido eliminar el archivo')
                        } else {
                            console.log(`El archivo ${fileName} ha sido eliminado correctamente`)
                        }
                    }
                )
            break;
        default:
            break;
    }
}



fileController()