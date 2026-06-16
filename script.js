  (function() {
    // ----- products -----
    const products = [
      { id: 1, name: 'Slim Fit Shirt', category: 'men', price: 49.99, discount: 20, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop&crop=center' },
      { id: 2, name: 'Summer Dress', category: 'women', price: 69.99, discount: 0, img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=300&fit=crop&crop=center' },
      { id: 3, name: 'Plaid Skirt', category: 'girls', price: 34.99, discount: 10, img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=300&fit=crop&crop=center' },
      { id: 4, name: 'Cargo Shorts', category: 'boys', price: 29.99, discount: 0, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop&crop=center' },
      { id: 5, name: 'Leather Jacket', category: 'men', price: 129.99, discount: 15, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=center' },
      { id: 6, name: 'Floral Blouse', category: 'women', price: 44.99, discount: 0, img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=300&fit=crop&crop=center' },
      { id: 7, name: 'Rainbow Tee', category: 'girls', price: 24.99, discount: 5, img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop&crop=center' },
      { id: 8, name: 'Sports Hoodie', category: 'boys', price: 39.99, discount: 12, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&crop=center' },
      { id: 9, name: 'Chino Pants', category: 'men', price: 59.99, discount: 0, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop&crop=center' },
      { id: 10, name: 'Evening Gown', category: 'women', price: 149.99, discount: 25, img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=300&fit=crop&crop=center' },
    ];

    // ----- state -----
    let cart = [];
    let currentCategory = 'all';
    let currentSlide = 0;

    // ----- DOM refs -----
    const grid = document.getElementById('productGrid');
    const categoryBtns = document.querySelectorAll('.cat-btn');
    const cartIcon = document.getElementById('cartIcon');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountSpan = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const contactNavBtn = document.getElementById('contactNavBtn');
    const contactSection = document.getElementById('contactSection');

    // scroll to contact
    contactNavBtn.addEventListener('click', () => {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    });

    // ----- render products -----
    function renderProducts(category = 'all') {
      const filtered = category === 'all' ? products : products.filter(p => p.category === category);
      if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-light);">No products in this category.</p>`;
        return;
      }
      grid.innerHTML = filtered.map(p => {
        const discountHtml = p.discount > 0 ? `<span class="price-discount">-${p.discount}%</span>` : '';
        const finalPrice = (p.price * (1 - p.discount/100)).toFixed(2);
        const inCart = cart.some(item => item.id === p.id);
        return `
          <div class="product-card" data-category="${p.category}">
            <div class="product-img" style="background-image: url('${p.img}');"></div>
            <div class="product-title">${p.name}</div>
            <div class="product-category">${p.category}</div>
            <div class="product-price">$${finalPrice} ${discountHtml}</div>
            <div class="product-footer">
              <span style="font-size:0.8rem; color:var(--text-light);"><i class="fas fa-star" style="color:var(--secondary);"></i> 4.8</span>
              <button class="btn-cart ${inCart ? 'in-cart' : ''}" data-id="${p.id}">${inCart ? '<i class="fas fa-check"></i> In Cart' : '<i class="fas fa-cart-plus"></i> Add'}</button>
            </div>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = parseInt(this.dataset.id);
          toggleCart(id);
        });
      });
    }

    // ----- cart functions -----
    function toggleCart(productId) {
      const index = cart.findIndex(item => item.id === productId);
      if (index > -1) {
        cart.splice(index, 1);
      } else {
        const product = products.find(p => p.id === productId);
        if (product) cart.push({ ...product, quantity: 1 });
      }
      updateCartUI();
      renderProducts(currentCategory);
    }

    function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCartUI();
      renderProducts(currentCategory);
    }

    function updateCartUI() {
      const total = cart.reduce((sum, item) => sum + (item.price * (1 - (item.discount||0)/100)), 0);
      cartTotalSpan.textContent = `$${total.toFixed(2)}`;
      cartCountSpan.textContent = cart.length;
      
      if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p style="color:var(--text-light); padding:1rem 0;">Your cart is empty.</p>`;
      } else {
        cartItemsDiv.innerHTML = cart.map(item => {
          const price = (item.price * (1 - (item.discount||0)/100)).toFixed(2);
          return `
            <div class="cart-item">
              <img src="${item.img}" alt="${item.name}">
              <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${price}</p>
              </div>
              <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
          `;
        }).join('');
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', function() {
            removeFromCart(parseInt(this.dataset.id));
          });
        });
      }
    }

    // ----- cart overlay -----
    cartIcon.addEventListener('click', () => {
      cartOverlay.classList.add('open');
      updateCartUI();
    });
    closeCart.addEventListener('click', () => cartOverlay.classList.remove('open'));
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) cartOverlay.classList.remove('open');
    });
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) { alert('Your cart is empty!'); return; }
      alert('🛍️ Order placed! Thank you for shopping with VividThreads.');
      cart = [];
      updateCartUI();
      renderProducts(currentCategory);
      cartOverlay.classList.remove('open');
    });

    // ----- category filter -----
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.cat;
        renderProducts(currentCategory);
      });
    });

    // ----- HERO SLIDER -----
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    function initDots() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }
    function goToSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.slider-dots span').forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      document.querySelectorAll('.slider-dots span')[index].classList.add('active');
      currentSlide = index;
    }
    function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
    function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }
    initDots();
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    setInterval(nextSlide, 5000);

    // ----- TESTIMONIAL SLIDER -----
    const testiTrack = document.getElementById('testiTrack');
    const testiPrev = document.getElementById('testiPrev');
    const testiNext = document.getElementById('testiNext');
    testiPrev.addEventListener('click', () => { testiTrack.scrollLeft -= 300; });
    testiNext.addEventListener('click', () => { testiTrack.scrollLeft += 300; });

    // ----- FAQ accordion -----
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-answer').classList.remove('open');
        });
        if (!isActive) {
          item.classList.add('active');
          answer.classList.add('open');
        }
      });
    });

    // ----- CONTACT FORM -----
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '⚠️ Please fill in all required fields.';
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '⚠️ Please enter a valid email address.';
        return;
      }

      formMessage.className = 'form-message success';
      formMessage.textContent = '✅ Thank you! Your message has been sent. We\'ll get back to you soon.';
      this.reset();
      setTimeout(() => {
        formMessage.className = 'form-message';
        formMessage.textContent = '';
      }, 5000);
    });

    // ----- Dark/Light mode -----
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const body = document.body;

    function setTheme(dark) {
      if (dark) {
        body.classList.add('dark');
        themeLabel.textContent = 'Light';
        themeToggle.innerHTML = `<i class="fas fa-sun"></i> <span id="themeLabel">Light</span>`;
      } else {
        body.classList.remove('dark');
        themeLabel.textContent = 'Dark';
        themeToggle.innerHTML = `<i class="fas fa-moon"></i> <span id="themeLabel">Dark</span>`;
      }
    }
    if (localStorage.getItem('theme') === 'dark') setTheme(true);
    else setTheme(false);

    themeToggle.addEventListener('click', function() {
      const isDark = body.classList.contains('dark');
      setTheme(!isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // ----- init -----
    renderProducts('all');
    updateCartUI();
  })();