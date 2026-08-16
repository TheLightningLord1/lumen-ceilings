
        // --- Логика Калькулятора ---
        const areaRange = document.getElementById('areaRange');
        const areaValue = document.getElementById('areaValue');
        const materialType = document.getElementById('materialType');
        const cornersInput = document.getElementById('corners');
        const lightsInput = document.getElementById('lights');
        const pipesCheck = document.getElementById('pipes');
        const pipesCountInput = document.getElementById('pipesCount');
        const totalPriceEl = document.getElementById('totalPrice');

        // Константы цен
        const PRICE_CORNER = 150; // руб за угол
        const PRICE_LIGHT = 400;  // руб за точку света
        const PRICE_PIPE = 300;   // руб за обвод трубы

        // Анимация count-up для цены
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = value.toLocaleString('ru-RU') + ' ₽';
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        let lastTotal = 0;

        function calculate() {
            // Получаем значения
            let area = parseInt(areaRange.value);
            let materialPricePerMeter = parseInt(materialType.value);
            let corners = parseInt(cornersInput.value) || 0;
            let lights = parseInt(lightsInput.value) || 0;
            let pipes = pipesCheck.checked ? (parseInt(pipesCountInput.value) || 0) : 0;

            // Обновляем отображение площади
            areaValue.textContent = area;

            // Расчет базы (Площадь * Цена материала)
            let total = area * materialPricePerMeter;

            // Добавляем углы
            if (corners > 4) {
                total += (corners - 4) * PRICE_CORNER;
            }

            // Добавляем свет
            total += lights * PRICE_LIGHT;

            // Добавляем трубы
            total += pipes * PRICE_PIPE;

            // Гарантируем, что цена никогда не будет 0
            if (total < 1) total = area * materialPricePerMeter;

            // Анимация чисел (count-up ~300мс)
            animateValue(totalPriceEl, lastTotal, total, 300);
            lastTotal = total;
        }

        // Слушатели событий
        areaRange.addEventListener('input', calculate);
        materialType.addEventListener('change', calculate);
        cornersInput.addEventListener('input', calculate);
        lightsInput.addEventListener('input', calculate);
        pipesCheck.addEventListener('change', () => {
            pipesCountInput.disabled = !pipesCheck.checked;
            calculate();
        });
        pipesCountInput.addEventListener('input', calculate);

        // Инициализация при загрузке
        calculate();

        // Кнопка "Зафиксировать цену" -> WhatsApp
       document.getElementById('fixPriceBtn').addEventListener('click', function() {
    const area = areaRange.value;
    const materialName = materialType.options[materialType.selectedIndex].text;
    const corners = cornersInput.value || 0;
    const lights = lightsInput.value || 0;
    const pipes = pipesCheck.checked ? (pipesCountInput.value || 0) : 0;
    const currentPrice = totalPriceEl.textContent;

    const message = 
`Здравствуйте! Хочу зафиксировать цену по расчету с сайта:

📐 Площадь: ${area} м²
🎨 Полотно: ${materialName}
📐 Углы: ${corners} шт.
💡 Светильники/люстры: ${lights} шт.
🛠 Обвод труб: ${pipesCheck.checked ? `${pipes} шт.` : 'нет'}

💰 Расчетная стоимость: ${currentPrice}`;

    const waUrl = `https://wa.me/79180790227?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
});

        // --- Обработка формы ---
        const form = document.getElementById('leadForm');
        const formMsg = document.getElementById('formMessage');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if(phone) {
                // Имитация отправки
                const btn = form.querySelector('button');
                const originalText = btn.textContent;

                btn.textContent = 'Отправка...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = 'Заявка отправлена!';
                    btn.style.backgroundColor = '#10b981'; // Green
                    formMsg.textContent = 'Спасибо! Перезвоним в течение дня.';
                    form.reset();

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                        formMsg.textContent = '';
                    }, 5000);
                }, 1000);
            } else {
                formMsg.textContent = 'Пожалуйста, введите телефон.';
                formMsg.style.color = 'red';
            }
        });

        // IntersectionObserver для fade-in секций + stagger для карточек
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Stagger для дочерних карточек
                    const cards = entry.target.querySelectorAll('.trust-card, .review-card, .project-card');
                    cards.forEach((card, index) => {
                        card.style.transitionDelay = `${index * 0.08}s`;
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-section').forEach(section => {
            observer.observe(section);
        });

        // Header scroll effect
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Мобильное меню (простая логика)
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '72px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(255,255,255,0.95)';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                navLinks.style.borderBottomLeftRadius = '16px';
                navLinks.style.borderBottomRightRadius = '16px';
                navLinks.style.gap = '16px';
                navLinks.style.zIndex = '999';
            }
        });

        // Закрытие мобильного меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });

        // Обработка ошибок загрузки изображений
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не найдено%3C/text%3E%3C/svg%3E';
            });
        });
