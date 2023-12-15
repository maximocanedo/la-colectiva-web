<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/components/components.css"/>
    <link rel="stylesheet" href="/components/material/material-components-web.css"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <title>Document</title>
    <link rel="stylesheet" href="./index.css" />
</head>
<body>
<?php
    include '../../components/web/drawer.component.php';
    include '../../components/web/header.component.php';
?>
<main class="mdc-top-app-bar--fixed-adjust">
    <span class="name"></span>
    <span class="username"></span>
    <span class="bio"></span>
    <span class="date"></span>
</main>
<script type="module" src="./index.js"></script>
</body>
</html>
