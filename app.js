var currentUser = null;       // кто сейчас вошёл
var currentProduct = null;    // какой товар сейчас открыт
var currentSlide = 0;         // номер активного слайда
var currentPage = 'home';     // название текущей страницы
var currentPageNum = 1;       // номер страницы пагинации
var itemsPerPage = 12;        // сколько товаров на странице

// Фильтры каталога
var filters = {
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    inStock: false,
    discount: false
};

var sortType = 'default';   // текущая сортировка
var searchQuery = '';        // поисковый запрос


//Запуск 

window.addEventListener('DOMContentLoaded', function() {

    // Восстанавливаем сохранённую тему
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    }

    // Восстанавливаем версию для слабовидящих
    var savedAccess = localStorage.getItem('accessibility');
    if (savedAccess === 'on') {
        document.body.classList.add('accessibility-mode');
        document.getElementById('accessibilityBanner').style.display = 'block';
    }

    // Запускаем всё остальное
    initData();
    checkAuth();
    setupListeners();
    updateBadges();
    startSlider();
    showPage('home');
});


//инициализация локал стора 

function initData() {

    // Если пользователей ещё нет — создаём одного (преподаватель)
    if (!localStorage.getItem('users')) {
        var defaultUsers = [
            {
                id: 1,
                name: 'Преподаватель',
                email: 'liubovsheyda@gmail.com',
                password: 'Teacher_2026',
                orders: [],
                favorites: [],
                bonuses: 500,
                reviews: []
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Если товаров нет — загружаем стандартные
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(getDefaultProducts()));
    }

    // Если заказов нет — пустой массив
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }

    // Если отзывов нет — пустой массив
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }
}


//Стандартные товары

function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'Ноутбук Apple MacBook Pro 16',
            category: 'Ноутбуки',
            brand: 'Apple',
            price: 249990,
            oldPrice: 299990,
            rating: 4.9,
            reviews: 156,
            inStock: true,
            image: '💻',
            description: 'Мощный профессиональный ноутбук с процессором M3 Pro, 16 ГБ RAM и SSD 512 ГБ.'
        },
        {
            id: 2,
            name: 'Смартфон Samsung Galaxy S26 Ultra',
            category: 'Смартфоны',
            brand: 'Samsung',
            price: 119990,
            oldPrice: null,
            rating: 4.8,
            reviews: 243,
            inStock: true,
            image: '📱',
            description: 'Флагманский смартфон с камерой 200 МП, 12 ГБ RAM и 256 ГБ памяти.'
        },
        {
            id: 3,
            name: 'Наушники Sony WH-1000XM6',
            category: 'Наушники',
            brand: 'Sony',
            price: 29990,
            oldPrice: 34990,
            rating: 4.7,
            reviews: 89,
            inStock: true,
            image: '🎧',
            description: 'Беспроводные наушники с активным шумоподавлением и временем работы до 30 часов.'
        },
        {
            id: 4,
            name: 'Планшет iPad Pro 12.9',
            category: 'Планшеты',
            brand: 'Apple',
            price: 139990,
            oldPrice: 159990,
            rating: 4.8,
            reviews: 124,
            inStock: true,
            image: '📲',
            description: 'Профессиональный планшет с процессором M2 и поддержкой Apple Pencil.'
        },
        {
            id: 5,
            name: 'Умные часы Apple Watch Series 10',
            category: 'Часы',
            brand: 'Apple',
            price: 54990,
            oldPrice: null,
            rating: 4.6,
            reviews: 78,
            inStock: true,
            image: '⌚',
            description: 'Смарт-часы с мониторингом здоровья, GPS и водонепроницаемостью до 50 метров.'
        },
        {
            id: 6,
            name: 'Игровая консоль PlayStation 6',
            category: 'Консоли',
            brand: 'Sony',
            price: 59990,
            oldPrice: 64990,
            rating: 4.9,
            reviews: 312,
            inStock: true,
            image: '🎮',
            description: 'Следующее поколение игровых консолей с поддержкой 8K и VR.'
        },
        {
            id: 7,
            name: 'Телевизор LG OLED 65"',
            category: 'Телевизоры',
            brand: 'LG',
            price: 179990,
            oldPrice: null,
            rating: 4.7,
            reviews: 67,
            inStock: false,
            image: '📺',
            description: 'OLED телевизор 4K с HDR10 и частотой обновления 120 Гц.'
        },
        {
            id: 8,
            name: 'Фотоаппарат Canon EOS R8',
            category: 'Фотоаппараты',
            brand: 'Canon',
            price: 189990,
            oldPrice: 209990,
            rating: 4.8,
            reviews: 45,
            inStock: true,
            image: '📷',
            description: 'Полнокадровая беззеркальная камера 24 МП с записью видео 4K.'
        },
        {
            id: 9,
            name: 'Клавиатура Logitech MX Keys',
            category: 'Аксессуары',
            brand: 'Logitech',
            price: 12990,
            oldPrice: null,
            rating: 4.5,
            reviews: 156,
            inStock: true,
            image: '⌨️',
            description: 'Беспроводная клавиатура с подсветкой и поддержкой до 3 устройств.'
        },
        {
            id: 10,
            name: 'Мышь Logitech MX Master 4',
            category: 'Аксессуары',
            brand: 'Logitech',
            price: 9990,
            oldPrice: 11990,
            rating: 4.6,
            reviews: 203,
            inStock: true,
            image: '🖱️',
            description: 'Эргономичная беспроводная мышь с 7 программируемыми кнопками.'
        },
        {
            id: 11,
            name: 'Монитор Dell UltraSharp 32"',
            category: 'Мониторы',
            brand: 'Dell',
            price: 84990,
            oldPrice: 94990,
            rating: 4.7,
            reviews: 91,
            inStock: true,
            image: '🖥️',
            description: 'Профессиональный монитор 4K с IPS-матрицей и охватом 99% sRGB.'
        },
        {
            id: 12,
            name: 'Роутер ASUS RT-AX89X',
            category: 'Сеть',
            brand: 'ASUS',
            price: 34990,
            oldPrice: null,
            rating: 4.4,
            reviews: 62,
            inStock: true,
            image: '📡',
            description: 'Wi-Fi 6 роутер со скоростью до 6000 Мбит/с и 8 антеннами.'
        },
        {
            id: 13,
            name: 'SSD Samsung 980 PRO 2TB',
            category: 'Накопители',
            brand: 'Samsung',
            price: 24990,
            oldPrice: 29990,
            rating: 4.9,
            reviews: 178,
            inStock: true,
            image: '💾',
            description: 'NVMe SSD PCIe 4.0 со скоростью до 7000 МБ/с.'
        },
        {
            id: 14,
            name: 'Видеокарта NVIDIA RTX 5080',
            category: 'Комплектующие',
            brand: 'NVIDIA',
            price: 149990,
            oldPrice: null,
            rating: 4.8,
            reviews: 134,
            inStock: false,
            image: '🎴',
            description: 'Мощная видеокарта с 16 ГБ GDDR6X для игр и профессиональной работы.'
        },
        {
            id: 15,
            name: 'Колонка JBL Charge 6',
            category: 'Аудио',
            brand: 'JBL',
            price: 14990,
            oldPrice: 16990,
            rating: 4.6,
            reviews: 201,
            inStock: true,
            image: '🔊',
            description: 'Портативная водонепроницаемая колонка с автономностью до 20 часов.'
        },
        {
            id: 16,
            name: 'Микрофон Blue Yeti X',
            category: 'Аудио',
            brand: 'Blue',
            price: 19990,
            oldPrice: null,
            rating: 4.7,
            reviews: 87,
            inStock: true,
            image: '🎤',
            description: 'Профессиональный USB-микрофон для стриминга и подкастов.'
        },
        {
            id: 17,
            name: 'Принтер HP LaserJet Pro',
            category: 'Оргтехника',
            brand: 'HP',
            price: 29990,
            oldPrice: 34990,
            rating: 4.3,
            reviews: 56,
            inStock: true,
            image: '🖨️',
            description: 'Лазерный принтер с Wi-Fi и скоростью 40 страниц в минуту.'
        },
        {
            id: 18,
            name: 'Сканер Epson Perfection V600',
            category: 'Оргтехника',
            brand: 'Epson',
            price: 24990,
            oldPrice: null,
            rating: 4.5,
            reviews: 43,
            inStock: true,
            image: '📠',
            description: 'Фотосканер 6400 dpi для оцифровки фотографий и слайдов.'
        }
    ];
}


//функции для локалстора 

function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

function getReviews() {
    return JSON.parse(localStorage.getItem('reviews') || '[]');
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}


//Утилита для форматирования цен

function formatPrice(price) {
    // Превращает число в строку вида "10 990 ₽"
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(price);
}


//звезды рейтинга 

function renderStars(rating) {
    // Просто возвращаем нужное количество звёздочек
    var stars = '';
    var full = Math.floor(rating);
    for (var i = 0; i < full; i++) {
        stars += '⭐';
    }
    // Если есть половина (например 4.5) — добавляем ещё звезду
    if (rating % 1 >= 0.5) {
        stars += '⭐';
    }
    return stars;
}


//уведомления о действиях на сайте

function showNotification(message, type) {
    // type = 'success' (зелёный) или 'error' (красный)
    var color = '#2196f3'; // синий по умолчанию
    if (type === 'success') color = '#4caf50';
    if (type === 'error')   color = '#f44336';

    var div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = 'position:fixed; top:20px; right:20px; padding:15px 20px;'
        + 'background:' + color + '; color:white; border-radius:6px;'
        + 'z-index:9999; font-size:16px;';

    document.body.appendChild(div);

    // Убираем через 3 секунды
    setTimeout(function() {
        div.remove();
    }, 3000);
}

//Утилита для обновления счетчиков 

function updateBadges() {
    // Корзина — считаем общее количество штук
    var cart = getCart();
    var cartCount = 0;
    for (var i = 0; i < cart.length; i++) {
        cartCount += cart[i].quantity;
    }
    document.getElementById('cartBadge').textContent = cartCount;

    // Избранное — просто длина массива
    var favCount = 0;
    if (currentUser) {
        favCount = currentUser.favorites ? currentUser.favorites.length : 0;
    }
    document.getElementById('favoriteBadge').textContent = favCount;

    // Иконка профиля меняется если вошли
    var profileBtn = document.getElementById('profileBtn');
    if (currentUser) {
        profileBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
        profileBtn.title = currentUser.name;
    } else {
        profileBtn.innerHTML = '<i class="fas fa-user"></i>';
        profileBtn.title = 'Войти';
    }
}

// Проверка авторизации 

function checkAuth() {
    var saved = localStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}


//Применяем все листенеры для событий 

function setupListeners() {

    // --- Навигация вверху ---
    var navLinks = document.querySelectorAll('.main-nav a');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            showPage(e.target.dataset.page);
        });
    }

    // --- Поиск ---
    document.getElementById('searchBtn').addEventListener('click', doSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') doSearch();
    });

    // --- Тёмная тема ---
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // --- Версия для слабовидящих ---
    document.getElementById('accessibilityToggle').addEventListener('click', toggleAccessibility);

    // --- Кнопки в шапке ---
    document.getElementById('favoriteBtn').addEventListener('click', function() {
        showPage('favorite');
    });
    document.getElementById('cartBtn').addEventListener('click', function() {
        showPage('cart');
    });
    document.getElementById('profileBtn').addEventListener('click', function() {
        if (currentUser) {
            showPage('profile');
        } else {
            showPage('auth');
        }
    });

    // --- Вкладки входа / регистрации ---
    var authTabs = document.querySelectorAll('.auth-tab');
    for (var j = 0; j < authTabs.length; j++) {
        authTabs[j].addEventListener('click', function(e) {
            // Убираем active у всех вкладок
            document.querySelectorAll('.auth-tab').forEach(function(t) {
                t.classList.remove('active');
            });
            e.target.classList.add('active');

            // Показываем нужную форму
            var tab = e.target.dataset.tab;
            if (tab === 'login') {
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('registerForm').style.display = 'none';
            } else {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'block';
            }
        });
    }

    // --- Формы ---
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        doLogin();
    });
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        doRegister();
    });

    // --- Фильтры каталога ---
    document.getElementById('sortSelect').addEventListener('change', function(e) {
        sortType = e.target.value;
        renderCatalog();
    });
    document.getElementById('minPrice').addEventListener('change', function(e) {
        filters.minPrice = e.target.value ? parseInt(e.target.value) : null;
        renderCatalog();
    });
    document.getElementById('maxPrice').addEventListener('change', function(e) {
        filters.maxPrice = e.target.value ? parseInt(e.target.value) : null;
        renderCatalog();
    });
    document.getElementById('inStockFilter').addEventListener('change', function(e) {
        filters.inStock = e.target.checked;
        renderCatalog();
    });
    document.getElementById('discountFilter').addEventListener('change', function(e) {
        filters.discount = e.target.checked;
        renderCatalog();
    });

    // --- Меню личного кабинета ---
    var menuItems = document.querySelectorAll('.profile-menu-item');
    for (var k = 0; k < menuItems.length; k++) {
        menuItems[k].addEventListener('click', function(e) {
            // Кнопка "Выход" обрабатывается отдельно через onclick в HTML
            if (e.target.classList.contains('logout')) return;

            // Убираем active у всех пунктов меню
            document.querySelectorAll('.profile-menu-item').forEach(function(item) {
                item.classList.remove('active');
            });
            e.target.classList.add('active');

            // Скрываем все секции профиля
            document.querySelectorAll('.profile-section').forEach(function(s) {
                s.style.display = 'none';
            });

            // Показываем нужную секцию
            var section = e.target.dataset.section;
            var sectionId = 'profile' + section.charAt(0).toUpperCase() + section.slice(1);
            document.getElementById(sectionId).style.display = 'block';

            renderProfileSection(section);
        });
    }

    // --- Закрытие модального окна ---
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target.id === 'modal') closeModal();
    });
}


//переключение страниц навигации 

function showPage(pageName) {
    // Скрываем все страницы
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }

    // Убираем active у ссылок навигации
    document.querySelectorAll('.main-nav a').forEach(function(link) {
        link.classList.remove('active');
    });

    // Подсвечиваем нужную ссылку (если есть)
    var activeLink = document.querySelector('[data-page="' + pageName + '"]');
    if (activeLink) activeLink.classList.add('active');

    currentPage = pageName;

    // Показываем нужную страницу и рендерим контент
    if (pageName === 'home') {
        document.getElementById('homePage').style.display = 'block';
        renderPopularProducts();

    } else if (pageName === 'catalog') {
        document.getElementById('catalogPage').style.display = 'block';
        renderFilters();
        renderCatalog();

    } else if (pageName === 'cart') {
        document.getElementById('cartPage').style.display = 'block';
        renderCart();

    } else if (pageName === 'favorite') {
        document.getElementById('favoritePage').style.display = 'block';
        renderFavorites();

    } else if (pageName === 'profile') {
        if (!currentUser) {
            showPage('auth');
            return;
        }
        document.getElementById('profilePage').style.display = 'block';
        renderProfileSection('info');

    } else if (pageName === 'auth') {
        document.getElementById('authPage').style.display = 'block';
    }
}


//слайдер акций

function startSlider() {
    var slides = document.querySelectorAll('.slide');
    var dotsContainer = document.querySelector('.slider-dots');

    // Создаём точки (dots) под слайдером
    for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function(e) {
            goToSlide(parseInt(e.target.getAttribute('data-index')));
        });
        dotsContainer.appendChild(dot);
    }

    // Автопролистывание каждые 5 секунд
    setInterval(function() {
        nextSlide();
    }, 5000);
}

//Утилиты для слайдера 

function nextSlide() {
    var slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    var slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    // Обновляем классы слайдов и точек
    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.slider-dot');

    for (var i = 0; i < slides.length; i++) {
        if (i === currentSlide) {
            slides[i].classList.add('active');
        } else {
            slides[i].classList.remove('active');
        }
    }

    for (var j = 0; j < dots.length; j++) {
        if (j === currentSlide) {
            dots[j].classList.add('active');
        } else {
            dots[j].classList.remove('active');
        }
    }
}

// Эту функцию вызывают кнопки "Смотреть/Перейти/Заказать" в слайдере (onclick в HTML)
function showCatalog() {
    showPage('catalog');
}


//Популярные товары нв главной странице 

function renderPopularProducts() {
    var products = getProducts();

    // Сортируем по рейтингу и берём топ-6
    products.sort(function(a, b) { return b.rating - a.rating; });
    var popular = products.slice(0, 6);

    var container = document.getElementById('popularProducts');
    var html = '';
    for (var i = 0; i < popular.length; i++) {
        html += createProductCard(popular[i]);
    }
    container.innerHTML = html;
}


//Главный поиск

function doSearch() {
    searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    currentPageNum = 1;
    showPage('catalog');
}


//Фильтры каталога

function renderFilters() {
    var products = getProducts();

    // Уникальные категории
    var categories = [];
    products.forEach(function(p) {
        if (categories.indexOf(p.category) === -1) categories.push(p.category);
    });

    var catHtml = '';
    categories.forEach(function(cat) {
        catHtml += '<label><input type="checkbox" value="' + cat + '" onchange="toggleCategoryFilter(\'' + cat + '\')">' + cat + '</label>';
    });
    document.getElementById('categoryFilters').innerHTML = catHtml;

    // Уникальные бренды
    var brands = [];
    products.forEach(function(p) {
        if (brands.indexOf(p.brand) === -1) brands.push(p.brand);
    });

    var brandHtml = '';
    brands.forEach(function(brand) {
        brandHtml += '<label><input type="checkbox" value="' + brand + '" onchange="toggleBrandFilter(\'' + brand + '\')">' + brand + '</label>';
    });
    document.getElementById('brandFilters').innerHTML = brandHtml;

    // Рейтинг
    document.getElementById('ratingFilters').innerHTML =
        '<label><input type="radio" name="rating" value="5" onchange="setRatingFilter(5)"> 5+ ⭐</label>' +
        '<label><input type="radio" name="rating" value="4" onchange="setRatingFilter(4)"> 4+ ⭐</label>' +
        '<label><input type="radio" name="rating" value="3" onchange="setRatingFilter(3)"> 3+ ⭐</label>';
}

function toggleCategoryFilter(cat) {
    // Если уже выбрана — снимаем, иначе ставим
    if (filters.category === cat) {
        filters.category = null;
    } else {
        filters.category = cat;
    }
    currentPageNum = 1;
    renderCatalog();
}

function toggleBrandFilter(brand) {
    if (filters.brand === brand) {
        filters.brand = null;
    } else {
        filters.brand = brand;
    }
    currentPageNum = 1;
    renderCatalog();
}

function setRatingFilter(rating) {
    filters.rating = rating;
    currentPageNum = 1;
    renderCatalog();
}

function resetFilters() {
    // Сбрасываем все фильтры в исходное состояние
    filters = {
        category: null,
        brand: null,
        minPrice: null,
        maxPrice: null,
        rating: null,
        inStock: false,
        discount: false
    };
    sortType = 'default';
    searchQuery = '';
    currentPageNum = 1;

    // Сбрасываем значения в полях формы
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'default';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('inStockFilter').checked = false;
    document.getElementById('discountFilter').checked = false;

    // Снимаем галочки/радио у фильтров
    var checkboxes = document.querySelectorAll('#categoryFilters input, #brandFilters input, #ratingFilters input');
    checkboxes.forEach(function(input) {
        input.checked = false;
    });

    renderCatalog();
}

//рендер каталога исходя из фильтров 

function renderCatalog() {
    var products = getProducts();

    // 1. Поиск по тексту
    if (searchQuery) {
        products = products.filter(function(p) {
            return p.name.toLowerCase().includes(searchQuery)
                || p.description.toLowerCase().includes(searchQuery)
                || p.category.toLowerCase().includes(searchQuery)
                || p.brand.toLowerCase().includes(searchQuery);
        });
    }

    // 2. Фильтр по категории
    if (filters.category) {
        products = products.filter(function(p) {
            return p.category === filters.category;
        });
    }

    // 3. Фильтр по бренду
    if (filters.brand) {
        products = products.filter(function(p) {
            return p.brand === filters.brand;
        });
    }

    // 4. Фильтр по минимальной цене
    if (filters.minPrice) {
        products = products.filter(function(p) {
            return p.price >= filters.minPrice;
        });
    }

    // 5. Фильтр по максимальной цене
    if (filters.maxPrice) {
        products = products.filter(function(p) {
            return p.price <= filters.maxPrice;
        });
    }

    // 6. Фильтр по рейтингу
    if (filters.rating) {
        products = products.filter(function(p) {
            return p.rating >= filters.rating;
        });
    }

    // 7. Только в наличии
    if (filters.inStock) {
        products = products.filter(function(p) {
            return p.inStock === true;
        });
    }

    // 8. Только со скидкой
    if (filters.discount) {
        products = products.filter(function(p) {
            return p.oldPrice !== null;
        });
    }

    // Сортировка
    if (sortType === 'price-asc') {
        products.sort(function(a, b) { return a.price - b.price; });
    } else if (sortType === 'price-desc') {
        products.sort(function(a, b) { return b.price - a.price; });
    } else if (sortType === 'rating-desc') {
        products.sort(function(a, b) { return b.rating - a.rating; });
    } else if (sortType === 'name-asc') {
        products.sort(function(a, b) { return a.name.localeCompare(b.name); });
    } else if (sortType === 'name-desc') {
        products.sort(function(a, b) { return b.name.localeCompare(a.name); });
    }

    // Пагинация — режем массив на страницы
    var totalPages = Math.ceil(products.length / itemsPerPage);
    var start = (currentPageNum - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var pageProducts = products.slice(start, end);

    // Показываем сколько нашлось
    document.getElementById('resultsCount').textContent = 'Найдено: ' + products.length + ' товаров';

    // Рисуем карточки
    var html = '';
    for (var i = 0; i < pageProducts.length; i++) {
        html += createProductCard(pageProducts[i]);
    }
    document.getElementById('catalogProducts').innerHTML = html;

    // Рисуем пагинацию
    renderPagination(totalPages);
}


//Паггинация 

function renderPagination(totalPages) {
    var container = document.getElementById('pagination');

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    var html = '';

    // Кнопка "назад"
    if (currentPageNum > 1) {
        html += '<button onclick="goToPage(' + (currentPageNum - 1) + ')">‹</button>';
    }

    // Номера страниц
    for (var i = 1; i <= totalPages; i++) {
        if (i === currentPageNum) {
            html += '<button class="active">' + i + '</button>';
        } else if (i === 1 || i === totalPages || (i >= currentPageNum - 2 && i <= currentPageNum + 2)) {
            html += '<button onclick="goToPage(' + i + ')">' + i + '</button>';
        } else if (i === currentPageNum - 3 || i === currentPageNum + 3) {
            html += '<span>...</span>';
        }
    }

    // Кнопка "вперёд"
    if (currentPageNum < totalPages) {
        html += '<button onclick="goToPage(' + (currentPageNum + 1) + ')">›</button>';
    }

    container.innerHTML = html;
}

function goToPage(page) {
    currentPageNum = page;
    renderCatalog();
    window.scrollTo(0, 0); // прокручиваем вверх
}


//Карточка товра 

function createProductCard(product) {
    // Считаем процент скидки
    var discount = 0;
    if (product.oldPrice) {
        discount = Math.round((1 - product.price / product.oldPrice) * 100);
    }

    var inFav  = isInFavorites(product.id);
    var inCart = isInCart(product.id);

    // Кнопка корзины
    var cartBtnText = inCart ? 'В корзине' : 'Купить';
    var cartBtnClass = inCart ? 'btn btn-secondary' : 'btn btn-primary';
    var cartAction = inCart ? 'removeFromCart(' + product.id + ')' : 'addToCart(' + product.id + ')';
    var cartDisabled = product.inStock ? '' : 'disabled';

    // Цвет сердечка
    var heartColor = inFav ? 'red' : 'inherit';

    var html = '<div class="product-card">';
    html += '  <div class="product-image" onclick="showProduct(' + product.id + ')">' + product.image + '</div>';
    html += '  <div class="product-name" onclick="showProduct(' + product.id + ')">' + product.name + '</div>';
    html += '  <div class="product-rating"><span class="stars">' + renderStars(product.rating) + '</span> (' + product.reviews + ')</div>';
    html += '  <div class="product-price">';
    html += '    <span class="price-current">' + formatPrice(product.price) + '</span>';
    if (product.oldPrice) {
        html += '    <span class="price-old">' + formatPrice(product.oldPrice) + '</span>';
        html += '    <span class="discount-badge">-' + discount + '%</span>';
    }
    html += '  </div>';
    if (!product.inStock) {
        html += '  <p style="color:red;">Нет в наличии</p>';
    }
    html += '  <div class="product-actions">';
    html += '    <button class="' + cartBtnClass + '" onclick="' + cartAction + '" ' + cartDisabled + '>';
    html += '      <i class="fas fa-shopping-cart"></i> ' + cartBtnText;
    html += '    </button>';
    html += '    <button class="btn btn-secondary" onclick="toggleFavorite(' + product.id + ')" style="color:' + heartColor + '">';
    html += '      <i class="fas fa-heart"></i>';
    html += '    </button>';
    html += '  </div>';
    html += '</div>';

    return html;
}

//показать карточку товара по ID 

function showProduct(id) {
    var products = getProducts();
    currentProduct = null;

    // Находим товар по id
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            currentProduct = products[i];
            break;
        }
    }

    if (!currentProduct) return;

    // Скрываем все страницы, показываем страницу товара
    document.querySelectorAll('.page').forEach(function(p) {
        p.style.display = 'none';
    });
    document.getElementById('productPage').style.display = 'block';

    var discount = 0;
    if (currentProduct.oldPrice) {
        discount = Math.round((1 - currentProduct.price / currentProduct.oldPrice) * 100);
    }

    var inFav  = isInFavorites(currentProduct.id);
    var inStock = currentProduct.inStock;

    var html = '<div class="product-details">';
    html += '  <div class="product-gallery">';
    html += '    <div class="product-image">' + currentProduct.image + '</div>';
    html += '  </div>';
    html += '  <div class="product-info">';
    html += '    <h1>' + currentProduct.name + '</h1>';
    html += '    <div class="product-rating"><span class="stars">' + renderStars(currentProduct.rating) + '</span>';
    html += '      ' + currentProduct.rating + ' (' + currentProduct.reviews + ' отзывов)</div>';
    html += '    <div class="product-price">';
    html += '      <span class="price-current">' + formatPrice(currentProduct.price) + '</span>';
    if (currentProduct.oldPrice) {
        html += '      <span class="price-old">' + formatPrice(currentProduct.oldPrice) + '</span>';
        html += '      <span class="discount-badge">-' + discount + '%</span>';
    }
    html += '    </div>';
    html += '    <div class="product-description">';
    html += '      <h3>Описание</h3>';
    html += '      <p>' + currentProduct.description + '</p>';
    html += '      <p><strong>Бренд:</strong> ' + currentProduct.brand + '</p>';
    html += '      <p><strong>Категория:</strong> ' + currentProduct.category + '</p>';
    html += '      <p><strong>Наличие:</strong> ' + (inStock ? '✅ В наличии' : '❌ Нет в наличии') + '</p>';
    html += '    </div>';
    html += '    <div class="product-actions" style="margin-top:20px;">';
    html += '      <button class="btn btn-primary" onclick="addToCart(' + currentProduct.id + ')" ' + (inStock ? '' : 'disabled') + '>';
    html += '        <i class="fas fa-shopping-cart"></i> ' + (inStock ? 'Добавить в корзину' : 'Нет в наличии');
    html += '      </button>';
    html += '      <button class="btn btn-secondary" onclick="toggleFavorite(' + currentProduct.id + ')">';
    html += '        <i class="fas fa-heart"></i> ' + (inFav ? 'В избранном' : 'В избранное');
    html += '      </button>';
    html += '      <button class="btn btn-secondary" onclick="showPage(\'catalog\')">';
    html += '        <i class="fas fa-arrow-left"></i> Назад';
    html += '      </button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    document.getElementById('productDetails').innerHTML = html;

    renderProductReviews();
}


//Создает отзывы 

function renderProductReviews() {
    var allReviews = getReviews();
    var reviews = [];

    // Оставляем только отзывы на текущий товар
    for (var i = 0; i < allReviews.length; i++) {
        if (allReviews[i].productId === currentProduct.id) {
            reviews.push(allReviews[i]);
        }
    }

    // Может ли текущий пользователь оставить отзыв?
    var canReview = false;
    if (currentUser) {
        canReview = true;
        for (var j = 0; j < reviews.length; j++) {
            if (reviews[j].userId === currentUser.id) {
                canReview = false; // уже оставил
                break;
            }
        }
    }

    var html = '<h2>Отзывы</h2>';

    // Форма добавления отзыва
    if (canReview) {
        html += '<div class="review-form">';
        html += '  <h3>Оставить отзыв</h3>';
        html += '  <div class="form-group"><label>Оценка</label>';
        html += '    <select id="reviewRating">';
        html += '      <option value="5">5 — Отлично</option>';
        html += '      <option value="4">4 — Хорошо</option>';
        html += '      <option value="3">3 — Нормально</option>';
        html += '      <option value="2">2 — Плохо</option>';
        html += '      <option value="1">1 — Ужасно</option>';
        html += '    </select></div>';
        html += '  <div class="form-group"><label>Комментарий</label>';
        html += '    <textarea id="reviewText" rows="4"></textarea></div>';
        html += '  <button class="btn btn-primary" onclick="addReview()">Отправить отзыв</button>';
        html += '</div>';
    }

    if (reviews.length === 0) {
        html += '<p>Пока нет отзывов. Будьте первым!</p>';
    } else {
        for (var k = 0; k < reviews.length; k++) {
            html += createReviewHTML(reviews[k]);
        }
    }

    document.getElementById('productReviews').innerHTML = html;
}

//Утилиты для отзывов 

function createReviewHTML(review) {
    var users = getUsers();
    var userName = 'Пользователь';
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === review.userId) {
            userName = users[i].name;
            break;
        }
    }

    var isOwner = currentUser && currentUser.id === review.userId;
    var date = new Date(review.date).toLocaleDateString();

    var html = '<div class="review">';
    html += '  <div class="review-header">';
    html += '    <div><strong>' + userName + '</strong><br>';
    html += '      <span class="stars">' + renderStars(review.rating) + '</span></div>';
    html += '    <div>' + date + '</div>';
    html += '  </div>';
    html += '  <div>' + review.text + '</div>';

    if (isOwner) {
        html += '  <div style="margin-top:10px;">';
        html += '    <button class="btn btn-secondary" onclick="editReview(' + review.id + ')">Редактировать</button>';
        html += '    <button class="btn btn-secondary" onclick="deleteReview(' + review.id + ')">Удалить</button>';
        html += '  </div>';
    }

    html += '</div>';
    return html;
}

function addReview() {
    if (!currentUser) {
        showNotification('Войдите, чтобы оставить отзыв', 'error');
        return;
    }

    var rating = parseInt(document.getElementById('reviewRating').value);
    var text = document.getElementById('reviewText').value.trim();

    if (!text) {
        showNotification('Напишите комментарий', 'error');
        return;
    }

    var reviews = getReviews();
    reviews.push({
        id: Date.now(),
        productId: currentProduct.id,
        userId: currentUser.id,
        rating: rating,
        text: text,
        date: new Date().toISOString()
    });

    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Пересчитываем средний рейтинг товара
    updateProductRating(currentProduct.id);

    showNotification('Отзыв добавлен!', 'success');
    renderProductReviews();
}

function editReview(id) {
    var reviews = getReviews();
    var review = null;

    for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].id === id) {
            review = reviews[i];
            break;
        }
    }

    if (!review) return;

    // Простой prompt для редактирования (учебный проект)
    var newText = prompt('Новый текст отзыва:', review.text);
    if (newText && newText.trim()) {
        review.text = newText.trim();
        localStorage.setItem('reviews', JSON.stringify(reviews));
        showNotification('Отзыв обновлён', 'success');
        renderProductReviews();
        // Обновляем в профиле, если открыт
        if (currentPage === 'profile') {
            renderProfileSection('reviews');
        }
    }
}

function deleteReview(id) {
    if (!confirm('Удалить отзыв?')) return;

    var reviews = getReviews();
    var newReviews = [];
    for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].id !== id) {
            newReviews.push(reviews[i]);
        }
    }

    localStorage.setItem('reviews', JSON.stringify(newReviews));
    updateProductRating(currentProduct.id);
    showNotification('Отзыв удалён', 'success');

    if (currentPage === 'profile') {
        renderProfileSection('reviews');
    } else {
        renderProductReviews();
    }
}

function updateProductRating(productId) {
    var reviews = getReviews();
    var productReviews = [];

    for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].productId === productId) {
            productReviews.push(reviews[i]);
        }
    }

    if (productReviews.length === 0) return;

    // Считаем среднее
    var sum = 0;
    for (var j = 0; j < productReviews.length; j++) {
        sum += productReviews[j].rating;
    }
    var avg = Math.round((sum / productReviews.length) * 10) / 10;

    // Сохраняем в товар
    var products = getProducts();
    for (var k = 0; k < products.length; k++) {
        if (products[k].id === productId) {
            products[k].rating = avg;
            products[k].reviews = productReviews.length;
            break;
        }
    }
    localStorage.setItem('products', JSON.stringify(products));
}

//Корзина и утилиты 

function isInCart(productId) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) return true;
    }
    return false;
}

function addToCart(productId) {
    var products = getProducts();
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }

    if (!product || !product.inStock) return;

    var cart = getCart();
    var found = false;

    // Если товар уже в корзине — увеличиваем количество
    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === productId) {
            cart[j].quantity++;
            found = true;
            break;
        }
    }

    // Иначе добавляем новый элемент
    if (!found) {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Товар добавлен в корзину', 'success');
    updateBadges();

    // Обновляем каталог чтобы поменялась кнопка
    if (currentPage === 'catalog') renderCatalog();
}

function removeFromCart(productId) {
    var cart = getCart();
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
    updateBadges();

    if (currentPage === 'cart') renderCart();
    if (currentPage === 'catalog') renderCatalog();
}

function changeQuantity(productId, delta) {
    // delta = +1 или -1
    var cart = getCart();

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity += delta;
            if (cart[i].quantity <= 0) {
                // Убираем из корзины если количество стало 0
                removeFromCart(productId);
                return;
            }
            break;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    var cart = getCart();
    var products = getProducts();

    if (cart.length === 0) {
        document.getElementById('cartContent').innerHTML =
            '<div style="text-align:center; padding:40px;">' +
            '  <i class="fas fa-shopping-cart" style="font-size:60px; color:#ccc;"></i>' +
            '  <h3 style="margin-top:15px;">Корзина пуста</h3>' +
            '  <button class="btn btn-primary" onclick="showPage(\'catalog\')" style="margin-top:15px;">Перейти к покупкам</button>' +
            '</div>';
        return;
    }

    var totalPrice = 0;
    var totalDiscount = 0;

    var itemsHtml = '';
    for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];
        var product = null;

        for (var j = 0; j < products.length; j++) {
            if (products[j].id === cartItem.id) {
                product = products[j];
                break;
            }
        }

        if (!product) continue;

        var itemTotal = product.price * cartItem.quantity;
        totalPrice += itemTotal;

        if (product.oldPrice) {
            totalDiscount += (product.oldPrice - product.price) * cartItem.quantity;
        }

        itemsHtml += '<div class="cart-item">';
        itemsHtml += '  <div class="cart-item-image">' + product.image + '</div>';
        itemsHtml += '  <div class="cart-item-info">';
        itemsHtml += '    <div class="cart-item-name">' + product.name + '</div>';
        itemsHtml += '    <div class="cart-item-price">' + formatPrice(product.price) + '</div>';
        itemsHtml += '    <div class="quantity-controls">';
        itemsHtml += '      <button onclick="changeQuantity(' + product.id + ', -1)">-</button>';
        itemsHtml += '      <span>' + cartItem.quantity + '</span>';
        itemsHtml += '      <button onclick="changeQuantity(' + product.id + ', 1)">+</button>';
        itemsHtml += '    </div>';
        itemsHtml += '  </div>';
        itemsHtml += '  <div>';
        itemsHtml += '    <div style="font-size:22px; font-weight:bold; margin-bottom:10px;">' + formatPrice(itemTotal) + '</div>';
        itemsHtml += '    <button class="btn btn-secondary" onclick="removeFromCart(' + product.id + ')"><i class="fas fa-trash"></i></button>';
        itemsHtml += '  </div>';
        itemsHtml += '</div>';
    }

    // Бонусы пользователя
    var bonusDiscount = 0;
    if (currentUser && currentUser.bonuses > 0) {
        bonusDiscount = Math.min(currentUser.bonuses, totalPrice * 0.3);
    }
    var finalPrice = totalPrice - bonusDiscount;

    var summaryHtml = '<div class="cart-summary"><h3>Итого</h3>';

    if (totalDiscount > 0) {
        summaryHtml += '<div class="summary-row"><span>Скидка на товары:</span><span style="color:green;">-' + formatPrice(totalDiscount) + '</span></div>';
    }
    if (bonusDiscount > 0) {
        summaryHtml += '<div class="summary-row"><span>Списание бонусов:</span><span style="color:green;">-' + formatPrice(bonusDiscount) + '</span></div>';
    }

    var totalQty = 0;
    for (var k = 0; k < cart.length; k++) totalQty += cart[k].quantity;

    summaryHtml += '<div class="summary-row"><span>Товаров (' + totalQty + ' шт.):</span><span>' + formatPrice(totalPrice) + '</span></div>';
    summaryHtml += '<div class="summary-row"><span class="summary-total">К оплате:</span><span class="summary-total">' + formatPrice(finalPrice) + '</span></div>';
    summaryHtml += '<button class="btn btn-primary" onclick="checkout()" style="width:100%; margin-top:15px;">Оформить заказ</button>';
    summaryHtml += '</div>';

    document.getElementById('cartContent').innerHTML = itemsHtml + summaryHtml;
}

function checkout() {
    if (!currentUser) {
        showNotification('Войдите для оформления заказа', 'error');
        showPage('auth');
        return;
    }

    var cart = getCart();
    if (cart.length === 0) return;

    var products = getProducts();
    var totalPrice = 0;

    for (var i = 0; i < cart.length; i++) {
        for (var j = 0; j < products.length; j++) {
            if (products[j].id === cart[i].id) {
                totalPrice += products[j].price * cart[i].quantity;
                break;
            }
        }
    }

    var bonusDiscount = Math.min(currentUser.bonuses || 0, totalPrice * 0.3);
    var finalPrice = totalPrice - bonusDiscount;

    // Создаём заказ
    var order = {
        id: Date.now(),
        userId: currentUser.id,
        items: cart,
        total: finalPrice,
        bonusUsed: bonusDiscount,
        date: new Date().toISOString(),
        status: 'Оформлен'
    };

    var orders = getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Обновляем бонусы пользователя
    var users = getUsers();
    for (var k = 0; k < users.length; k++) {
        if (users[k].id === currentUser.id) {
            users[k].bonuses = (users[k].bonuses || 0) - bonusDiscount;
            users[k].bonuses += Math.floor(finalPrice * 0.05); // 5% кешбэк
            currentUser = users[k];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            break;
        }
    }
    localStorage.setItem('users', JSON.stringify(users));

    // Очищаем корзину
    localStorage.setItem('cart', JSON.stringify([]));

    showNotification('Заказ оформлен!', 'success');
    updateBadges();
    showPage('profile');
    renderProfileSection('orders');
}

//Избранное 

function isInFavorites(productId) {
    if (!currentUser || !currentUser.favorites) return false;
    return currentUser.favorites.indexOf(productId) !== -1;
}

function toggleFavorite(productId) {
    if (!currentUser) {
        showNotification('Войдите, чтобы добавить в избранное', 'error');
        showPage('auth');
        return;
    }

    var users = getUsers();
    var userInList = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].id === currentUser.id) {
            userInList = users[i];
            break;
        }
    }

    if (!userInList.favorites) userInList.favorites = [];

    var index = userInList.favorites.indexOf(productId);
    if (index !== -1) {
        // Уже есть — удаляем
        userInList.favorites.splice(index, 1);
        showNotification('Удалено из избранного', 'success');
    } else {
        // Нет — добавляем
        userInList.favorites.push(productId);
        showNotification('Добавлено в избранное', 'success');
    }

    localStorage.setItem('users', JSON.stringify(users));
    currentUser = userInList;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    updateBadges();

    if (currentPage === 'favorite') renderFavorites();
    if (currentPage === 'catalog')  renderCatalog();
}

function renderFavorites() {
    if (!currentUser) {
        document.getElementById('favoriteContent').innerHTML =
            '<div style="text-align:center; padding:40px;">' +
            '  <p>Войдите, чтобы просмотреть избранное</p>' +
            '  <button class="btn btn-primary" onclick="showPage(\'auth\')">Войти</button>' +
            '</div>';
        return;
    }

    var favorites = currentUser.favorites || [];
    var products = getProducts();
    var favProducts = [];

    for (var i = 0; i < products.length; i++) {
        if (favorites.indexOf(products[i].id) !== -1) {
            favProducts.push(products[i]);
        }
    }

    if (favProducts.length === 0) {
        document.getElementById('favoriteContent').innerHTML =
            '<div style="text-align:center; padding:40px;">' +
            '  <i class="fas fa-heart" style="font-size:60px; color:#ccc;"></i>' +
            '  <h3 style="margin-top:15px;">Список избранного пуст</h3>' +
            '  <button class="btn btn-primary" onclick="showPage(\'catalog\')" style="margin-top:15px;">Перейти к покупкам</button>' +
            '</div>';
        return;
    }

    var html = '';
    for (var j = 0; j < favProducts.length; j++) {
        html += createProductCard(favProducts[j]);
    }
    document.getElementById('favoriteContent').innerHTML = html;
}


//Авторизация

function doLogin() {
    var email    = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;

    var users = getUsers();
    var found = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            found = users[i];
            break;
        }
    }

    if (found) {
        currentUser = found;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Вы вошли в аккаунт!', 'success');
        updateBadges();
        showPage('home');
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

function doRegister() {
    var name     = document.getElementById('registerName').value.trim();
    var email    = document.getElementById('registerEmail').value.trim();
    var password = document.getElementById('registerPassword').value;
    var confirm  = document.getElementById('registerPasswordConfirm').value;

    if (password !== confirm) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    var users = getUsers();

    // Проверяем что email не занят
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            showNotification('Пользователь с таким email уже существует', 'error');
            return;
        }
    }

    var newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        orders: [],
        favorites: [],
        bonuses: 0,
        reviews: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Регистрация прошла успешно!', 'success');
    updateBadges();
    showPage('home');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Вы вышли из аккаунта', 'success');
    updateBadges();
    showPage('home');
}

//Личный кабинет пользователя 

function renderProfileSection(section) {
    // Показываем нужную секцию и скрываем остальные
    document.querySelectorAll('.profile-section').forEach(function(s) {
        s.style.display = 'none';
    });

    var sectionId = 'profile' + section.charAt(0).toUpperCase() + section.slice(1);
    document.getElementById(sectionId).style.display = 'block';

    if (section === 'info')      renderProfileInfo();
    if (section === 'orders')    renderProfileOrders();
    if (section === 'favorites') renderProfileFavorites();
    if (section === 'bonuses')   renderProfileBonuses();
    if (section === 'reviews')   renderProfileReviews();
}

function renderProfileInfo() {
    document.getElementById('profileInfo').innerHTML =
        '<h2>Личная информация</h2>' +
        '<form onsubmit="updateProfile(event)">' +
        '  <div class="form-group"><label>Имя</label>' +
        '    <input type="text" id="profileName" value="' + currentUser.name + '" required></div>' +
        '  <div class="form-group"><label>Email</label>' +
        '    <input type="email" value="' + currentUser.email + '" disabled></div>' +
        '  <button type="submit" class="btn btn-primary">Сохранить</button>' +
        '</form>';
}

function updateProfile(e) {
    e.preventDefault();
    var name = document.getElementById('profileName').value.trim();

    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === currentUser.id) {
            users[i].name = name;
            currentUser = users[i];
            break;
        }
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showNotification('Профиль обновлён', 'success');
    updateBadges();
}

function renderProfileOrders() {
    var orders = getOrders();
    var products = getProducts();

    // Берём только заказы текущего пользователя
    var myOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].userId === currentUser.id) {
            myOrders.push(orders[i]);
        }
    }

    if (myOrders.length === 0) {
        document.getElementById('profileOrders').innerHTML =
            '<h2>Мои заказы</h2><p>У вас пока нет заказов</p>';
        return;
    }

    var html = '<h2>Мои заказы</h2>';

    for (var j = 0; j < myOrders.length; j++) {
        var order = myOrders[j];

        // Список товаров в заказе
        var itemsList = '';
        for (var k = 0; k < order.items.length; k++) {
            var cartItem = order.items[k];
            for (var m = 0; m < products.length; m++) {
                if (products[m].id === cartItem.id) {
                    itemsList += products[m].name + ' x' + cartItem.quantity + '<br>';
                    break;
                }
            }
        }

        html += '<div style="background:#f5f5f5; padding:20px; margin-bottom:15px; border:1px solid #ddd;">';
        html += '  <div style="display:flex; justify-content:space-between;">';
        html += '    <div><strong>Заказ #' + order.id + '</strong><br>' + new Date(order.date).toLocaleDateString() + '</div>';
        html += '    <div style="text-align:right;"><strong>' + formatPrice(order.total) + '</strong><br>' + order.status + '</div>';
        html += '  </div>';
        html += '  <div style="margin-top:10px;">' + itemsList + '</div>';
        if (order.bonusUsed > 0) {
            html += '  <div style="color:green;">Бонусов списано: ' + formatPrice(order.bonusUsed) + '</div>';
        }
        html += '</div>';
    }

    document.getElementById('profileOrders').innerHTML = html;
}

function renderProfileFavorites() {
    var favorites = currentUser.favorites || [];
    var products = getProducts();
    var favProducts = [];

    for (var i = 0; i < products.length; i++) {
        if (favorites.indexOf(products[i].id) !== -1) {
            favProducts.push(products[i]);
        }
    }

    var html = '<h2>Избранные товары</h2>';
    if (favProducts.length === 0) {
        html += '<p>Нет избранных товаров</p>';
    } else {
        html += '<div class="products-grid">';
        for (var j = 0; j < favProducts.length; j++) {
            html += createProductCard(favProducts[j]);
        }
        html += '</div>';
    }

    document.getElementById('profileFavorites').innerHTML = html;
}

function renderProfileBonuses() {
    document.getElementById('profileBonuses').innerHTML =
        '<h2>Бонусы</h2>' +
        '<div style="background:#1976d2; color:white; padding:30px; text-align:center; margin-bottom:20px; border-radius:8px;">' +
        '  <div>Доступно бонусов</div>' +
        '  <div style="font-size:48px; font-weight:bold; margin:10px 0;">' + formatPrice(currentUser.bonuses || 0) + '</div>' +
        '  <div>Можно потратить до 30% от суммы заказа</div>' +
        '</div>' +
        '<div style="background:#f5f5f5; padding:20px; border:1px solid #ddd;">' +
        '  <h3>Как получить бонусы:</h3>' +
        '  <ul style="margin-top:10px; line-height:2;">' +
        '    <li>🛒 5% кешбэк с каждой покупки</li>' +
        '    <li>⭐ За отзывы на товары</li>' +
        '    <li>📧 За участие в акциях</li>' +
        '  </ul>' +
        '</div>';
}

function renderProfileReviews() {
    var allReviews = getReviews();
    var products = getProducts();
    var myReviews = [];

    for (var i = 0; i < allReviews.length; i++) {
        if (allReviews[i].userId === currentUser.id) {
            myReviews.push(allReviews[i]);
        }
    }

    if (myReviews.length === 0) {
        document.getElementById('profileReviews').innerHTML =
            '<h2>Мои отзывы</h2><p>Вы ещё не оставили ни одного отзыва</p>';
        return;
    }

    var html = '<h2>Мои отзывы</h2>';

    for (var j = 0; j < myReviews.length; j++) {
        var review = myReviews[j];
        var productName = 'Товар удалён';

        for (var k = 0; k < products.length; k++) {
            if (products[k].id === review.productId) {
                productName = products[k].name;
                break;
            }
        }

        html += '<div style="background:#f5f5f5; padding:20px; margin-bottom:15px; border:1px solid #ddd;">';
        html += '  <div style="display:flex; justify-content:space-between;">';
        html += '    <strong>' + productName + '</strong>';
        html += '    <span>' + new Date(review.date).toLocaleDateString() + '</span>';
        html += '  </div>';
        html += '  <div class="stars" style="margin:5px 0;">' + renderStars(review.rating) + '</div>';
        html += '  <div>' + review.text + '</div>';
        html += '  <div style="margin-top:10px;">';
        html += '    <button class="btn btn-secondary" onclick="editReview(' + review.id + ')">Редактировать</button>';
        html += '    <button class="btn btn-secondary" onclick="deleteReview(' + review.id + ')">Удалить</button>';
        html += '  </div>';
        html += '</div>';
    }

    document.getElementById('profileReviews').innerHTML = html;
}


//темная тема

function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    var isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Меняем иконку кнопки
    var icon = document.querySelector('#themeToggle i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

//Версия для слабовидящих

function toggleAccessibility() {
    document.body.classList.toggle('accessibility-mode');

    var isOn = document.body.classList.contains('accessibility-mode');
    localStorage.setItem('accessibility', isOn ? 'on' : 'off');

    document.getElementById('accessibilityBanner').style.display = isOn ? 'block' : 'none';
}

//Всплывающие окна

function showModal(content) {
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}


// Объект app — нужен для обработки нажатий из Html кодом app.js
// слайдер использует app.nextSlide(), app.prevSlide()

var app = {
    nextSlide:      function() { nextSlide(); },
    prevSlide:      function() { prevSlide(); },
    showCatalog:    function() { showCatalog(); },
    resetFilters:   function() { resetFilters(); },
    logout:         function() { logout(); }
};