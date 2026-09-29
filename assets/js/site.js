/* Alpha Psi Alumni Association site script — no dependencies. */
(function () {
	document.documentElement.classList.remove('no-js');

	/* ---------- Header: solid after scrolling past the top ---------- */
	var header = document.querySelector('.site-header');
	function onScroll() {
		if (header) header.classList.toggle('solid', window.scrollY > 40);
	}
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	/* ---------- Mobile navigation ---------- */
	var toggle = document.querySelector('.nav-toggle');
	function closeNav() {
		document.body.classList.remove('nav-open');
		if (toggle) toggle.setAttribute('aria-expanded', 'false');
	}
	if (toggle) {
		toggle.addEventListener('click', function () {
			var open = document.body.classList.toggle('nav-open');
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
		document.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', closeNav); });
	}

	/* ---------- Dropdowns (click / keyboard; hover handled in CSS) ---------- */
	document.querySelectorAll('.has-drop').forEach(function (li) {
		var btn = li.querySelector('.nav-drop-toggle');
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			var open = li.classList.toggle('open');
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	});
	document.addEventListener('click', function (e) {
		document.querySelectorAll('.has-drop.open').forEach(function (li) {
			if (!li.contains(e.target)) {
				li.classList.remove('open');
				li.querySelector('.nav-drop-toggle').setAttribute('aria-expanded', 'false');
			}
		});
	});

	/* ---------- Scroll reveal ---------- */
	var reveals = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('in');
					io.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
		reveals.forEach(function (el) { io.observe(el); });
	} else {
		reveals.forEach(function (el) { el.classList.add('in'); });
	}

	/* ---------- Lightbox: any element with data-lightbox="image url" ---------- */
	var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
	if (items.length && typeof HTMLDialogElement === 'function') {
		var box = document.createElement('dialog');
		box.className = 'lightbox';
		box.innerHTML = '<button class="lb-close" type="button" aria-label="Close"><i class="fas fa-times"></i></button>' +
			'<button class="lb-nav lb-prev" type="button" aria-label="Previous photo"><i class="fas fa-chevron-left"></i></button>' +
			'<img alt=""><p></p>' +
			'<button class="lb-nav lb-next" type="button" aria-label="Next photo"><i class="fas fa-chevron-right"></i></button>';
		document.body.appendChild(box);
		var img = box.querySelector('img');
		var cap = box.querySelector('p');
		var current = 0;
		function show(i) {
			current = (i + items.length) % items.length;
			img.src = items[current].getAttribute('data-lightbox');
			img.alt = items[current].getAttribute('data-caption') || '';
			cap.textContent = items[current].getAttribute('data-caption') || '';
		}
		items.forEach(function (el, i) {
			el.setAttribute('tabindex', el.tabIndex >= 0 ? el.tabIndex : 0);
			function open() { show(i); box.showModal(); }
			el.addEventListener('click', open);
			el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
		});
		var single = items.length < 2;
		box.querySelectorAll('.lb-nav').forEach(function (b) { b.hidden = single; });
		box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
		box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
		box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
		box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
		box.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') show(current - 1);
			if (e.key === 'ArrowRight') show(current + 1);
		});
	}

	/* ---------- Contact form -> opens the visitor's email app ---------- */
	var form = document.getElementById('contact-form');
	if (form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var topic = form.elements.topic.value;
			var name = form.elements.name.value.trim();
			var subject = form.elements.subject.value.trim();
			subject = '[' + topic + '] ' + (subject || 'Message from alphapsiaa.com');
			var body = form.elements.message.value.trim();
			var cls = form.elements.mcclass.value.trim();
			if (name || cls) body += '\n\n- ' + name + (cls ? ' (' + cls + ')' : '');
			window.location.href = 'mailto:alphapsiaa@kkpsi.org?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
		});
	}

	/* ---------- Member roster (roster page only) ---------- */
	var roster = document.getElementById('roster');
	if (roster) {
		var input = document.getElementById('roster-q');
		var countEl = document.getElementById('roster-count');
		var filterBtns = document.querySelectorAll('[data-filter]');
		var filter = 'all';
		var data = [];

		function esc(s) {
			return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
		}
		function norm(s) {
			return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() : s.toLowerCase();
		}
		function hi(text, q) {
			if (!q) return esc(text);
			var i = norm(text).indexOf(q);
			if (i < 0) return esc(text);
			return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
		}
		function render() {
			var q = norm(input.value.trim());
			var total = 0, html = '';
			data.forEach(function (c) {
				var classHit = q && norm(c.c).indexOf(q) >= 0;
				var list = c.m.filter(function (m) {
					if (filter === 'honorary' && !m.h) return false;
					if (filter === 'life' && !m.l) return false;
					if (!q || classHit) return true;
					return norm(m.n).indexOf(q) >= 0 || (m.p && norm(m.p).indexOf(q) >= 0);
				});
				if (!list.length) return;
				total += list.length;
				html += '<details class="class-block"' + (q || filter !== 'all' ? ' open' : '') + '><summary><h3>' + hi(c.c, classHit ? q : '') + '</h3>' +
					(c.y ? '<span class="yr">' + c.y + '</span>' : '') +
					'<span class="n">' + list.length + (list.length === 1 ? ' brother' : ' brothers') + '</span></summary><ul class="class-members">' +
					list.map(function (m) {
						var tags = (m.h ? '<span class="chip gold">Honorary</span>' : '') + (m.l ? '<span class="chip maroon">Life</span>' : '');
						return '<li><span class="nm">' + hi(m.n, q) + '</span>' + (tags ? '<span class="tags">' + tags + '</span>' : '') +
							(m.p ? '<small>' + hi(m.p, q) + '</small>' : '') + '</li>';
					}).join('') + '</ul></details>';
			});
			roster.innerHTML = html || '<p class="callout"><i class="fas fa-search"></i><span>No brothers match that search. Try a last name, a class like <b>Delta Chi</b>, or an office like <b>President</b>.</span></p>';
			countEl.textContent = 'Showing ' + total.toLocaleString() + ' brother' + (total === 1 ? '' : 's');
		}
		filterBtns.forEach(function (b) {
			b.addEventListener('click', function () {
				filter = b.getAttribute('data-filter');
				filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
				render();
			});
		});
		var t;
		input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 120); });
		fetch('data/roster.json').then(function (r) { return r.json(); }).then(function (json) {
			data = json;
			var all = 0;
			json.forEach(function (c) { all += c.m.length; });
			var s = document.getElementById('roster-total');
			if (s) s.textContent = all.toLocaleString();
			var cc = document.getElementById('roster-classes');
			if (cc) cc.textContent = json.length;
			render();
		}).catch(function () {
			roster.innerHTML = '<p class="callout"><i class="fas fa-exclamation-triangle"></i><span>The roster could not be loaded. Please refresh the page.</span></p>';
		});
	}

	/* ---------- Footer year ---------- */
	document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
