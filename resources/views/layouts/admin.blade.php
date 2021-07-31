<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="/css/admin.css{{ '?' . env('ASSETS_ADMIN_VERSION', 'xl56fgyh11') }}" rel="stylesheet">

    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }

        .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    </style>
</head>
<body class="antialiased">
    <!-- Content -->
    <main id="page">
        @yield('content')
    </main>
    @yield('loader')
    <!-- Styles -->
    <link href="{{ mix('dist/admin/css/app.css') }}" rel="stylesheet">
    <!-- Scripts -->
    <script src="{{ mix('dist/admin/js/app.js') }}" defer></script>
</body>
</html>
