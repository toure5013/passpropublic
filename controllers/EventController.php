<?php
class EventController {
    private $db;

    public function __construct() {
        // In a real application, you would connect to a database here
        // For this example, we'll use static data
    }

    public function getFeaturedEvent() {
        return [
            'id' => '1',
            'title' => 'DJ Arafat en concert',
            'date' => '31 Juillet 2024',
            'location' => 'Palais de la culture d\'Abidjan',
            'image' => 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
            'price' => 'À partir de 5000 F CFA',
            'description' => 'Ne manquez pas le concert événement de l\'année ! Une soirée exceptionnelle remplie d\'énergie et de tubes incontournables.'
        ];
    }

    public function getUpcomingEvents() {
        return [
            [
                'id' => '2',
                'title' => 'Festival des Musiques Urbaines',
                'date' => '15 - 16 Août 2024',
                'location' => 'Stade FHB, Abidjan',
                'image' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
                'price' => 'À partir de 10000 F CFA'
            ],
            [
                'id' => '3',
                'title' => 'Concert Alpha Blondy',
                'date' => '22 Août 2024',
                'location' => 'Sofitel Hôtel Ivoire',
                'image' => 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
                'price' => 'À partir de 15000 F CFA'
            ],
            [
                'id' => '4',
                'title' => 'Festival d\'Abidjan',
                'date' => '29 - 31 Août 2024',
                'location' => 'Place Jean-Paul II',
                'image' => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
                'price' => 'À partir de 7500 F CFA'
            ],
            [
                'id' => '5',
                'title' => 'Magic System Live',
                'date' => '5 Septembre 2024',
                'location' => 'Palais des Sports',
                'image' => 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec',
                'price' => 'À partir de 8000 F CFA'
            ]
        ];
    }
}