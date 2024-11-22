<?php 
require_once 'controllers/EventController.php';
$eventController = new EventController();
$featuredEvent = $eventController->getFeaturedEvent();
$events = $eventController->getUpcomingEvents();

include 'views/layouts/header.php'; 
?>

<div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-3xl sm:text-4xl font-bold mb-4 animate-title">
                Vos billets en un clic
            </h1>
            <p class="text-white/90 mb-8 text-lg animate-subtitle">
                Découvrez et réservez les meilleurs événements en Côte d'Ivoire
            </p>
            <div class="relative max-w-2xl animate-search">
                <input
                    type="text"
                    placeholder="Rechercher un événement..."
                    class="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                >
                <svg class="absolute left-4 top-4 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Categories -->
        <div class="swiper-container categories-slider mb-8">
            <div class="swiper-wrapper">
                <?php
                $categories = ['Tous', 'Concerts', 'Festivals', 'Sport', 'Théâtre', 'Humour'];
                foreach ($categories as $category): ?>
                    <div class="swiper-slide">
                        <button class="px-6 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow whitespace-nowrap text-sm font-medium text-gray-700 hover:text-brand-red hover:bg-brand-yellow/10">
                            <?php echo htmlspecialchars($category); ?>
                        </button>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Featured Event -->
        <div class="featured-event mb-8 opacity-0">
            <?php include 'components/featured-event.php'; ?>
        </div>

        <!-- Event Grid -->
        <h2 class="text-2xl font-bold text-gray-900 mb-6 animate-title">Événements à venir</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php foreach ($events as $event): ?>
                <div class="event-card opacity-0">
                    <?php include 'components/event-card.php'; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php include 'views/layouts/footer.php'; ?>