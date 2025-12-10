document.addEventListener('DOMContentLoaded', () => {
  console.log('Octa-Stack Script Loaded');

  // 1. Инициализация иконок (Safe Mode)
  try {
      if (typeof lucide !== 'undefined') {
          lucide.createIcons();
      }
  } catch (e) { console.error('Icons error:', e); }

  // 2. Mobile Menu (Burger)
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
      burger.addEventListener('click', () => {
          burger.classList.toggle('active');
          nav.classList.toggle('active');
      });

      document.querySelectorAll('.nav__link').forEach(link => {
          link.addEventListener('click', () => {
              burger.classList.remove('active');
              nav.classList.remove('active');
          });
      });
  }

  // 3. Анимации (GSAP)
  try {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);

          // Hero
          const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          heroTl.from('.hero__content', { y: 30, opacity: 0, duration: 1, delay: 0.2 })
                .from('.hero__visual', { x: 30, opacity: 0, duration: 1 }, '-=0.8');

          // Sections
          document.querySelectorAll('section:not(#hero)').forEach(sec => {
              gsap.from(sec, {
                  scrollTrigger: {
                      trigger: sec,
                      start: 'top 85%',
                      toggleActions: 'play none none reverse'
                  },
                  y: 40,
                  opacity: 0,
                  duration: 0.8
              });
          });
      }
  } catch (e) { console.warn('Animations skipped'); }

  // ==========================================
  // 4. ФОРМА (СТРОГАЯ ВАЛИДАЦИЯ)
  // ==========================================
  const form = document.getElementById('leadForm');

  if (form) {
      // --- A. Блокировка букв в телефоне ---
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
          phoneInput.addEventListener('input', function(e) {
              // Заменяем всё, что НЕ цифра, плюс, минус, скобка или пробел, на пустоту
              this.value = this.value.replace(/[^\d\+\-\(\)\s]/g, '');
          });
      }

      // --- B. Капча ---
      const captchaLabel = document.getElementById('captchaLabel');
      const captchaInput = document.getElementById('captchaInput');
      const num1 = Math.floor(Math.random() * 5) + 1;
      const num2 = Math.floor(Math.random() * 5) + 1;
      const correctAnswer = num1 + num2;

      if (captchaLabel) captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

      // --- C. Обработчик отправки ---
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          let isValid = true;

          // Сброс ошибок
          document.querySelectorAll('.form-group, .form-checkbox').forEach(el => el.classList.remove('error'));

          // 1. Проверка текстовых полей
          const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
          inputs.forEach(input => {
              const group = input.closest('.form-group');
              const val = input.value.trim();

              if (!val) {
                  group.classList.add('error');
                  isValid = false;
              }
              else if (input.type === 'email' && !val.includes('@')) {
                  group.classList.add('error'); // Простая проверка email
                  isValid = false;
              }
              else if (input.type === 'tel' && val.length < 7) {
                  group.classList.add('error'); // Слишком короткий номер
                  isValid = false;
              }
          });

          // 2. Проверка ЧЕКБОКСА (Обязательно)
          const checkbox = document.getElementById('consent');
          if (checkbox && !checkbox.checked) {
              // Ищем родителя .form-checkbox и красим его
              checkbox.closest('.form-checkbox').classList.add('error');
              // Можно добавить красную рамку через CSS для .error
              checkbox.closest('.form-checkbox').style.color = 'var(--color-secondary)';
              isValid = false;
          } else if (checkbox) {
              checkbox.closest('.form-checkbox').style.color = ''; // Сброс цвета
          }

          // 3. Проверка Капчи
          if (captchaInput) {
              if (parseInt(captchaInput.value) !== correctAnswer) {
                  captchaInput.closest('.form-group').classList.add('error');
                  isValid = false;
              }
          }

          // ИТОГ
          if (isValid) {
              const btn = form.querySelector('button[type="submit"]');
              btn.textContent = 'Отправка...';
              btn.disabled = true;

              // Имитация отправки
              setTimeout(() => {
                  form.style.display = 'none';
                  const successMsg = document.getElementById('formSuccess');
                  if (successMsg) {
                      successMsg.style.display = 'block';
                      if(typeof gsap !== 'undefined') gsap.from(successMsg, {y: 20, opacity: 0});
                  }
              }, 1000);
          } else {
              // Вибрация формы при ошибке
              if(typeof gsap !== 'undefined') {
                  gsap.to(form, {x: [-5, 5, -5, 5, 0], duration: 0.3});
              }
          }
      });

      // Убираем ошибки при вводе
      form.querySelectorAll('input').forEach(input => {
          input.addEventListener('input', function() {
              if (this.type === 'checkbox') {
                   this.closest('.form-checkbox').classList.remove('error');
                   this.closest('.form-checkbox').style.color = '';
              } else {
                   this.closest('.form-group').classList.remove('error');
              }
          });
      });
  }

  // 5. Cookie Popup
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');
  if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => { cookiePopup.style.display = 'flex'; }, 2000);
      if (acceptBtn) {
          acceptBtn.addEventListener('click', () => {
              localStorage.setItem('cookiesAccepted', 'true');
              cookiePopup.style.display = 'none';
          });
      }
  }

  // 6. Year Update
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});