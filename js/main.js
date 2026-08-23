
        // --- Маска ввода телефона ---
        const phoneInput = document.getElementById('phone');
        
        function createPhoneMask(input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length === 0) {
                    e.target.value = '';
                    return;
                }
                
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                if (value.length > 10) value = value.substring(0, 10);
                
                let formatted = '+7';
                if (value.length > 0) formatted += ' (' + value.substring(0, 3);
                if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
                if (value.length >= 7) formatted += '-' + value.substring(6, 8);
                if (value.length >= 9) formatted += '-' + value.substring(8, 10);
                
                e.target.value = formatted;
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && e.target.value === '+7') {
                    e.preventDefault();
                }
            });
            
            input.addEventListener('focus', function() {
                if (!e.target.value) {
                    e.target.value = '+7 (';
                }
            });
            
            input.addEventListener('blur', function() {
                if (e.target.value === '+7 ()' || e.target.value === '+7') {
                    e.target.value = '';
                }
            });
        }
        
        createPhoneMask(phoneInput);

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

            const phone = document.getElementById('phone').value.trim();

            // Проверка: минимум 10 цифр (без учёта +7)
            const digitsOnly = phone.replace(/\D/g, '');
            if (digitsOnly.length >= 11) {
                // Имитация отправки
                const btn = form.querySelector('button');
                const originalText = btn.textContent;

                btn.textContent = 'Отправка...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = 'Заявка отправлена!';
                    btn.style.backgroundColor = '#10b981'; // Green
                    formMsg.textContent = 'Спасибо! Перезвоним в течение дня.';
                    formMsg.style.color = '#10b981';
                    form.reset();

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                        formMsg.textContent = '';
                    }, 5000);
                }, 1000);
            } else {
                formMsg.textContent = 'Пожалуйста, введите корректный номер телефона (10 цифр).';
                formMsg.style.color = '#ef4444';
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

        // Мобильное меню (улучшенная логика)
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        let isMenuOpen = false;

        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '72px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(255,255,255,0.98)';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.padding = '24px 16px';
                navLinks.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
                navLinks.style.borderBottomLeftRadius = '16px';
                navLinks.style.borderBottomRightRadius = '16px';
                navLinks.style.gap = '8px';
                navLinks.style.zIndex = '999';
                navLinks.style.animation = 'slideDown 0.3s ease';
                menuToggle.textContent = '✕';
                document.body.style.overflow = 'hidden';
            } else {
                navLinks.style.display = '';
                navLinks.style.flexDirection = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.left = '';
                navLinks.style.width = '';
                navLinks.style.background = '';
                navLinks.style.backdropFilter = '';
                navLinks.style.padding = '';
                navLinks.style.boxShadow = '';
                navLinks.style.borderRadius = '';
                navLinks.style.gap = '';
                navLinks.style.zIndex = '';
                navLinks.style.animation = '';
                menuToggle.textContent = '☰';
                document.body.style.overflow = '';
            }
        }

        menuToggle.addEventListener('click', toggleMenu);

        // Закрытие мобильного меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && isMenuOpen) {
                    toggleMenu();
                }
            });
        });

        // Закрытие меню при изменении размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                toggleMenu();
            }
        });

        // Добавляем анимацию для мобильного меню
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .nav-links a { padding: 12px 0; font-size: 1.1rem; border-bottom: 1px solid rgba(0,0,0,0.06); }
            .nav-links a:last-child { border-bottom: none; }
        `;
        document.head.appendChild(style);

        // Обработка ошибок загрузки изображений
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не найдено%3C/text%3E%3C/svg%3E';
            });
        });
});
