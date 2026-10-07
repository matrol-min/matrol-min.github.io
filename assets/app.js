/* Renders the CV from data/cv.json + data/labels.en.json. No dependencies. */
(function () {
  var LIMIT = 5;
  var app = document.getElementById('app');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function people(names, self) {
    return names.map(function (n) {
      return self.indexOf(n.replace(/[+*†‡]+$/, '')) >= 0 ? '<strong>' + esc(n) + '</strong>' : esc(n);
    }).join(', ');
  }

  function sec(id, label, body) {
    return '<section class="sec" id="' + id + '"><h2>' + esc(label) + '</h2><div class="sec-body">' + body + '</div></section>';
  }

  function entries(list) {
    return list.map(function (e) {
      var ul = e.bullets.length ? '<ul>' + e.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '';
      return '<article class="entry"><span class="date">' + esc(e.period) + '</span><div class="entry-main"><h3>' + esc(e.title) +
        '</h3>' + (e.sub ? '<div class="sub">' + esc(e.sub) + '</div>' : '') + ul + '</div></article>';
    }).join('');
  }

  function badge(label, solid) {
    return label ? '<span class="badge' + (solid ? ' solid' : '') + '">' + esc(label) + '</span>' : '';
  }

  function group(key, anchor, label, unit, items, render, L) {
    var sorted = items.map(function (it, i) { return [it, i]; })
      .sort(function (a, b) { return b[0].year - a[0].year || a[1] - b[1]; })
      .map(function (x) { return x[0]; });
    var lis = sorted.map(function (it, i) {
      var yearHead = i === 0 || sorted[i - 1].year !== it.year;
      var cls = 'item' + (i === 0 ? ' first' : '') + (yearHead ? ' yr' : '') + (i >= LIMIT ? ' extra' : '');
      return '<li class="' + cls + '"' + (i >= LIMIT ? ' hidden' : '') + '><span class="year">' + (yearHead ? it.year : '') +
        '</span><div class="item-main">' + render(it) + '</div></li>';
    }).join('');
    var rest = sorted.length - LIMIT;
    var more = rest > 0
      ? '<button type="button" class="toggle" aria-expanded="false" aria-controls="list-' + key + '" data-more="' +
        esc(L.more.replace('{n}', rest)) + '" data-less="' + esc(L.less) + '">' + esc(L.more.replace('{n}', rest)) + '</button>'
      : '';
    return '<div><div class="group-head"><h3 id="' + anchor + '">' + esc(label) + '</h3><span class="cnt">' +
      sorted.length + ' ' + esc(unit) + '</span></div><ol class="items" id="list-' + key + '">' + lis + '</ol>' +
      '<div class="group-foot">' + more + '<a class="back" href="#summary">↑ ' + esc(L.back) + '</a></div></div>';
  }

  function render(D, L) {
    var P = D.person, C = D.counts, self = D.self;
    var paper = function (p) {
      var doi = p.doi ? '<a href="https://doi.org/' + encodeURI(p.doi) + '">doi:' + esc(p.doi) + '</a>' : '';
      var b = p.role === 'first' ? badge(L.role.first, true) : p.role === 'corresponding' ? badge(L.role.corresponding, false) : '';
      return '<div class="t">' + esc(p.title) + '</div><div class="people">' + people(p.authors, self) +
        '</div><div class="meta"><span>' + esc(p.venue) + '</span>' + doi + b + '</div>';
    };
    var patent = function (p) {
      return '<div class="t">' + esc(p.title) + '</div><div class="people">' + people(p.inventors, self) +
        '</div><div class="meta"><span class="num">' + esc(p.number) + '</span>' + badge(L.status[p.status], p.status === 'registered') + '</div>';
    };
    var by = function (list, scope) { return list.filter(function (x) { return x.scope === scope; }); };

    var jumps = [
      ['intl-papers', L.intlPapers, C.intlPapers], ['dom-papers', L.domPapers, C.domPapers],
      ['intl-patents', L.intlPatents, C.intlPatents, C.intlRegistered], ['dom-patents', L.domPatents, C.domPatents, C.domRegistered]
    ];
    var metrics = [[L.mPapers, C.papers], [L.mFirst, C.firstAuthor], [L.mFiled, C.patentsFiled], [L.mRegistered, C.registered]];

    var photo = '<img class="photo" src="' + esc(P.photo) + '" alt="' + esc(P.photoAlt) + '" width="144" height="144" decoding="async">';
    var html =
      '<header class="head">' + photo +
      '<div class="id"><h1>' + esc(P.name) + '</h1><div class="title">' + esc(P.title) + '</div></div>' +
      '<div class="contact"><span>' + esc(P.org) + '</span><span>' + esc(P.degree) + '</span><span><span class="lbl">' + esc(L.email) + '</span> <a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></span>' +
      (P.website ? '<span><span class="lbl">' + esc(L.website) + '</span> <a href="' + esc(P.website) + '">' + esc(P.website.replace(/^https?:\/\//, '')) + '</a></span>' : '') +
      '<span class="cv-dl" hidden><span class="lbl">' + esc(L.cv) + '</span> <a href="assets/cv.pdf" download="Sung-Yong_Min_CV.pdf">' + esc(L.downloadCv) + '</a></span></div></header>' +
      sec('profile', L.profile, '<ul class="plain-list profile-list">' + D.profile.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>') +
      sec('summary', L.summary,
        '<div class="metrics">' + metrics.map(function (m) {
          return '<div class="metric"><span>' + esc(m[0]) + '</span><span class="num">' + m[1] + '</span></div>';
        }).join('') + '</div>' +
        '<ul class="jumps" aria-label="' + esc(L.jump) + '">' + jumps.map(function (j) {
          return '<li class="jump"><span class="name">' + esc(j[1]) + '</span><span class="n">' + j[2] + '</span><span class="reg">' +
            (j[3] != null ? '(' + esc(L.registeredN.replace('{n}', j[3])) + ')' : '') + '</span><a href="#' + j[0] + '">' + esc(L.jump) + ' →</a></li>';
        }).join('') + '</ul>') +
      sec('experience', L.experience, entries(D.experience)) +
      sec('education', L.education, entries(D.education)) +
      sec('interests', L.interests, '<ul class="plain-list cols">' + D.interests.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
      sec('projects', L.projects, entries(D.projects)) +
      sec('skills', L.skills, '<ul class="plain-list">' + D.skills.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
      sec('awards', L.awards, D.awards.map(function (a) {
        return '<div class="entry award"><span class="date">' + esc(a.k) + '</span><span class="award-v">' + esc(a.v) +
          (a.sub ? '<span class="sub">, ' + esc(a.sub) + '</span>' : '') + '</span></div>';
      }).join('')) +
      '<nav class="listnav" aria-label="' + esc(L.lists) + '"><ul>' + jumps.map(function (j) {
        return '<li><a href="#' + j[0] + '"><span>' + esc(j[1]) + '</span><span class="pill">' + j[2] + '</span></a></li>';
      }).join('') + '</ul></nav>' +
      sec('publications', L.publications, '<div class="groups">' +
        group('ip', 'intl-papers', L.intlPapers, L.papers, by(D.papers, 'international'), paper, L) +
        group('dp', 'dom-papers', L.domPapers, L.papers, by(D.papers, 'domestic'), paper, L) + '</div>') +
      sec('patents', L.patents, '<div class="groups">' +
        group('it', 'intl-patents', L.intlPatents, L.patentsUnit, by(D.patents, 'international'), patent, L) +
        group('dt', 'dom-patents', L.domPatents, L.patentsUnit, by(D.patents, 'domestic'), patent, L) + '</div>');

    app.innerHTML = html;
    document.title = P.name + ' — Curriculum Vitae';

    // show the download link only when the generated PDF exists (CI builds it; locally run scripts/make_pdf.sh)
    fetch('assets/cv.pdf', { method: 'HEAD' }).then(function (r) { if (r.ok) app.querySelector('.cv-dl').hidden = false; }).catch(function () {});

    var img = app.querySelector('.photo');
    img.addEventListener('error', function () {
      var ph = document.createElement('div');
      ph.className = 'photo photo-ph';
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', P.photoAlt);
      ph.textContent = P.name.split(/[\s-]+/).map(function (w) { return w[0]; }).join('').slice(0, 2);
      img.replaceWith(ph);
    }, { once: true });

    app.querySelectorAll('.toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var list = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') === 'true';
        list.querySelectorAll('.extra').forEach(function (li) { li.hidden = open; });
        btn.setAttribute('aria-expanded', String(!open));
        btn.textContent = open ? btn.dataset.more : btn.dataset.less;
      });
    });
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  Promise.all([fetch('data/cv.json'), fetch('data/labels.en.json')])
    .then(function (r) { return Promise.all(r.map(function (x) { if (!x.ok) throw new Error(x.url); return x.json(); })); })
    .then(function (r) { render(r[0], r[1]); })
    .catch(function (e) { app.textContent = 'Failed to load CV data (' + e.message + '). Serve this folder over http(s).'; });
})();
