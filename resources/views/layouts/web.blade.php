<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="/css/web.css{{ '?' . env('ASSETS_VERSION', 'traa6884') }}" rel="stylesheet">

</head>
<body class="antialiased">
    <main id="page">
        @yield('content')
    </main>
</body>
</html>
