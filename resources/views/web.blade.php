@extends('layouts.web')

@section('content')
    <div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
        <p>{{ config('app.name', 'Laravel') }}</p>
    </div>
@endsection
