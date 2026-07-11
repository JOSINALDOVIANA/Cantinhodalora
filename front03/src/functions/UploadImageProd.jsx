import { IconButton } from '@mui/material';
import { uniqueId } from 'lodash';
import React from 'react';
import {api} from '../services/api.jsx';
import Swal from 'sweetalert2';
import { PhotoCamera } from '@mui/icons-material';

export default function UploadImageUser({ props }) {
  const [progress, setProgress] = React.useState(0);

  const handleUpload = async (ee) => {
    const files = ee.target.files;
    let uploadedFiles = [];

    for (let iterator of files) {
      uploadedFiles.push({
        file: iterator,
        id: uniqueId(),
        name: iterator.name,
        prod: false,
        readableSize: iterator.size,
        preview: URL.createObjectURL(iterator),
        url: URL.createObjectURL(iterator),
      });
    }

    const data = new FormData();
    data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

    try {
      // Toast inicial com barra zerada
      Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 0, // não fecha automaticamente
        title: "Iniciando upload...",
        html: `<div style="width:100%; background:#eee; border-radius:5px;">
                 <div id="progress-bar" style="width:0%; background:#4caf50; height:10px; border-radius:5px; transition: width 0.3s;"></div>
               </div>
               <p id="progress-text" style="margin-top:5px; font-size:14px;">0%</p>`
      });

      const response = await api.post(`${props.upUrl}`, data, {
        onUploadProgress: e => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setProgress(progress);

          // Atualiza barra e texto dentro do Swal
          const bar = document.getElementById("progress-bar");
          const text = document.getElementById("progress-text");
          if (bar && text) {
            bar.style.width = `${progress}%`;
            text.innerText = `${progress}%`;
          }
        }
      });

      // Toast de sucesso
      Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: "success",
        title: "Upload realizado com sucesso!"
      });

      // Atualiza imagens
      props.refetchImages();

    } catch (error) {
      // console.error(error);
      Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: "error",
        title: "Formato de arquivo não aceito"
      });
    }
  };

  return (
    <IconButton sx={{ mr: 2 }} color="success" component="label">
      <input
        id='img'
        hidden
        accept="image/*"
        type="file"
        onChange={handleUpload}
      />
      <PhotoCamera />
    </IconButton>
  );
}


