import { IconButton } from '@mui/material';
import { uniqueId } from 'lodash';
import React from 'react';
import { useLoadImagesProducts } from '../services/UseQuery/ImagesQuery';
import Swal from 'sweetalert2';
import { PhotoCamera } from '@mui/icons-material';

// import { Container } from './styles';

function UploadImageProd() {
    const { refreshImages } = useLoadImagesProducts(); // Hook para atualizar a lista de imagens
    return (<IconButton
        sx={{
            mr: 2
        }}
        color="success"
        component="label">
        <input id='img' hidden accept="image/*" type="file"
            onChange={async (ee) => {

                const files = ee.target.files;
                let uploadedFiles = []


                for (let iterator of files) {

                    uploadedFiles.push(
                        {
                            "file": iterator,
                            "id": uniqueId(),//definindo um id unico 
                            "name": iterator.name,
                            "prod": false,
                            "readableSize": iterator.size,
                            preview: URL.createObjectURL(iterator), // criando um link para preview da foto carregada
                            url: URL.createObjectURL(iterator),// sera usado para setar a variavel img no proprietario/index.js
                        }
                    )
                }



                // CRIANDO UM DATAFORM
                const data = new FormData();
                data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);                

                try {
                    const response = await api.post(`/api/images/uploadProduct`, data, {
                        onUploadProgress: e => {
                            const progress = Math.round((e.loaded * 100) / e.total);
                            // setProgress(progress); // se quiser mostrar progresso
                        }
                    });

                    // Toast de sucesso
                    Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: toast => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    }).fire({
                        icon: "success",
                        title: "Upload realizado com sucesso!"
                    });

                    // Buscar imagens atualizadas
                    refreshImages();
                } catch (error) {
                    console.error(error);

                    Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: toast => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    }).fire({
                        icon: "error",
                        title: "Formato de arquivo não aceito"
                    });
                }

            }}
        />

        <PhotoCamera />
    </IconButton>);
}

export default UploadImageProd;