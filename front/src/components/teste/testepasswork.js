<Card
    sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 150, // limite opcional
        minWidth: 150,
        maxHeight: 300,
        minHeight: 300,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
    }}
>
    <CardMedia
        component="div"
        sx={{
            backgroundImage: `url(${produto?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: { xs: 200, sm: 250, md: 300 }, // altura adaptável
        }}
    />
    <CardContent
        sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: "center",
        }}
    >
        <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.9rem" } }}
        >
            {produto?.name + ' ' + produto?.size}
        </Typography>
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.9rem" } }}
        >
            {produto?.descricao}
        </Typography>
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" } }}
        >
            R$ {produto?.price}
        </Typography>

    </CardContent>
</Card>