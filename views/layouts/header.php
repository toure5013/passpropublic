<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PassPro - Billeterie</title>
    <link rel="icon" type="image/svg+xml" href="/assets/images/logo.png">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
    <script src="https://unpkg.com/gsap"></script>
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
</head>
<body class="bg-gray-50">
    <div id="page-transition" class="fixed inset-0 bg-brand-red z-50 transform translate-x-full"></div>
    
    <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center space-x-2">
                        <img src="/assets/images/logo.png" alt="PassPro" class="h-8">
                    </a>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <input
                            type="text"
                            placeholder="Rechercher un événement..."
                            class="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                        >
                        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    
                    <a href="/cart" class="relative p-2">
                        <svg class="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span class="absolute -top-1 -right-1 bg-brand-yellow text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            0
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </nav>