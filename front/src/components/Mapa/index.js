import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, DialogContent } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;





export default function SimpleDialogDemo() {
    const [open, setOpen] = React.useState(false);

    const position = [0.036504, -51.048996]; // exemplo: Macapá/AP

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);

    };

    return (
        <>
            <LocationOnIcon onClick={() => {
                handleClickOpen();
            }} />

            <Dialog
                onClose={handleClose}
                open={open}
                // PaperProps={{
                //     sx: {
                //         borderRadius: 3,
                //         p: 2,
                //         minWidth: 400,
                //         minHeight: 500,
                //         background: 'linear-gradient(135deg, #E3F2FD, #FCE4EC)',
                //     },
                // }}
            >
                <DialogTitle>Localização</DialogTitle>
                <DialogContent
                sx={{ height: 400, width:"300px" }}
                >
                    <MapContainer
                        center={position}
                        zoom={50}
                        scrollWheelZoom={false}                                               
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </DialogContent>
            </Dialog>

        </>
    );
}
