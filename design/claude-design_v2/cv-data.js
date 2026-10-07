/* Academic CV — shared labels, sample data, and view-model builder.
   In production: cv-data/*.yml → JSON at build time; metric counts are aggregated from the lists.
   Everything below except name / title / affiliation is SAMPLE content. */
(function () {
  const LABELS = {
    en: {
      profile: 'Profile', summary: 'Research Summary', experience: 'Experience', education: 'Education',
      interests: 'Research Interests', projects: 'Research Projects', skills: 'Skills', awards: 'Awards',
      publications: 'Publications', patents: 'Patents',
      intlPapers: 'International Papers', domPapers: 'Domestic Papers',
      intlPatents: 'International Patents', domPatents: 'Domestic Patents',
      mPapers: 'Papers', mFirst: 'First-author', mFiled: 'Patents filed', mGranted: 'Patents granted',
      firstAuthor: '1st author', corresponding: 'Corresponding', granted: 'Granted', filed: 'Filed',
      paper: 'paper', papers: 'papers', patent: 'patent', patentsUnit: 'patents',
      back: 'Back to summary', showAll: 'Show all', showLess: 'Show less', jump: 'Go to list',
      sections: 'Sections', email: 'Email'
    }
  };

  const DATA = {
    person: {
      name: 'Sung-Yong Min', title: 'Principal Engineer',
      org: 'Visual Display Business, Samsung Electronics',
      degree: 'Ph.D., Materials Science & Engineering, POSTECH',
      email: 'sungyong.min@example.com',
      photo: 'cv-data/SYMin-050.jpeg', // single place to swap the profile photo
      photoAlt: 'Portrait of Sung-Yong Min'
    },
    profile: 'Process engineer working on interconnection and repair technologies for micro-LED displays. Background in printed organic and nanowire electronics, with experience taking laboratory processes to mass-production lines.',
    counts: { papers: 31, firstAuthor: 10, patentsFiled: 153, patentsGranted: 70, intlPapers: 24, domPapers: 7, intlPatents: 108, domPatents: 45 },
    experience: [
      { period: '2019 – Present', role: 'Principal Engineer', org: 'Samsung Electronics · Visual Display Business', bullets: ['Lead micro-LED interconnection and pixel-repair process development', 'Transfer of bonding and laser-repair processes to mass production'] },
      { period: '2014 – 2019', role: 'Senior Engineer', org: 'Samsung Electronics · Visual Display Business', bullets: ['Developed fine-pitch bonding processes for large-format displays'] },
      { period: '2013 – 2014', role: 'Postdoctoral Researcher', org: 'POSTECH · Materials Science & Engineering', bullets: ['Printed organic nanowire electronics'] }
    ],
    education: [
      { period: '2008 – 2013', degree: 'Ph.D., Materials Science & Engineering', org: 'POSTECH', note: 'Dissertation on printed organic nanowire devices' },
      { period: '2004 – 2008', degree: 'B.S., Materials Science & Engineering', org: 'POSTECH', note: '' }
    ],
    interests: ['Micro-LED interconnection', 'Laser-assisted pixel repair', 'Mass transfer processes', 'Printed & flexible electronics', 'Organic nanowire devices'],
    projects: [
      { period: '2021 – 2024', title: 'Laser-based repair of defective micro-LED pixels', sponsor: 'Samsung Electronics (internal)', role: 'Project lead' },
      { period: '2017 – 2020', title: 'Low-temperature bonding for large-area modular displays', sponsor: 'Samsung Electronics (internal)', role: 'Process lead' },
      { period: '2010 – 2013', title: 'Direct printing of aligned organic nanowires', sponsor: 'National Research Foundation of Korea', role: 'Graduate researcher' }
    ],
    skills: [
      { group: 'Process', items: ['Micro-LED transfer', 'Laser bonding & repair', 'ACF bonding', 'Photolithography'] },
      { group: 'Characterization', items: ['SEM / FIB', 'XPS', 'Electrical reliability testing'] },
      { group: 'Tools', items: ['Python', 'MATLAB', 'COMSOL'] }
    ],
    awards: [
      { year: '2023', title: 'Samsung Best Engineer Award', org: 'Samsung Electronics' },
      { year: '2013', title: 'Best Doctoral Dissertation Award', org: 'POSTECH' },
      { year: '2012', title: 'Best Poster Award', org: 'International conference (sample)' }
    ],
    papers: {
      intl: [
        { title: 'Laser-assisted repair of defective pixels in high-density micro-LED arrays', authors: ['S.-Y. Min', 'J. Park', 'H. Kim', 'D. Lee'], self: 0, venue: 'Adv. Mater. Technol.', vol: '9', pages: '2400123', year: 2024, doi: '10.0000/sample.2024.001', first: true, corr: true },
        { title: 'Low-temperature interconnection for modular micro-LED displays', authors: ['K. Choi', 'S.-Y. Min', 'Y. Jung'], self: 1, venue: 'IEEE Trans. Electron Devices', vol: '69', pages: '4102–4108', year: 2022, doi: '10.0000/sample.2022.014', first: false, corr: true },
        { title: 'Reliability of anisotropic conductive bonding at sub-30 µm pitch', authors: ['H. Lee', 'S.-Y. Min', 'J. Yoon', 'T. Kang'], self: 1, venue: 'J. Soc. Inf. Disp.', vol: '29', pages: '512–520', year: 2022, doi: '10.0000/sample.2022.031', first: false, corr: false },
        { title: 'Organic nanowire transistors printed over large areas', authors: ['S.-Y. Min', 'T.-S. Kim', 'Y. Lee', 'T.-W. Lee'], self: 0, venue: 'Nat. Commun.', vol: '4', pages: '1773', year: 2013, doi: '10.0000/sample.2013.007', first: true, corr: false },
        { title: 'Aligned nanowire arrays for flexible complementary circuits', authors: ['S.-Y. Min', 'W. Xu', 'T.-W. Lee'], self: 0, venue: 'Adv. Mater.', vol: '25', pages: '5520–5525', year: 2013, doi: '10.0000/sample.2013.019', first: true, corr: false }
      ],
      dom: [
        { title: 'Process window analysis for laser repair of micro-LED modules', authors: ['S.-Y. Min', 'J. Han'], self: 0, venue: 'J. Microelectron. Packag. Soc.', vol: '30', pages: '45–52', year: 2023, doi: '10.0000/sample.2023.k02', first: true, corr: true },
        { title: 'Thermal stress in fine-pitch bonded display modules', authors: ['M. Song', 'S.-Y. Min'], self: 1, venue: 'Korean J. Met. Mater.', vol: '58', pages: '210–217', year: 2020, doi: '10.0000/sample.2020.k05', first: false, corr: true },
        { title: 'Printing conditions for organic semiconductor nanowires', authors: ['S.-Y. Min', 'T.-W. Lee'], self: 0, venue: 'Polym. Sci. Technol.', vol: '24', pages: '88–94', year: 2013, doi: '10.0000/sample.2013.k01', first: true, corr: false }
      ]
    },
    patents: {
      intl: [
        { title: 'Display module and method for repairing defective micro light-emitting diodes', inventors: ['S.-Y. Min', 'J. Park', 'H. Kim'], self: 0, number: 'US 11,000,101 B2', office: 'USPTO', date: '2024-03-12', year: 2024, status: 'granted' },
        { title: 'Transfer substrate for micro light-emitting diodes', inventors: ['K. Choi', 'S.-Y. Min'], self: 1, number: 'US 2024/0000202 A1', office: 'USPTO', date: '2024-01-18', year: 2024, status: 'filed' },
        { title: 'Display apparatus with laser-bonded interconnection', inventors: ['S.-Y. Min', 'D. Lee'], self: 0, number: 'EP 4 000 303 B1', office: 'EPO', date: '2023-09-06', year: 2023, status: 'granted' },
        { title: 'Method of manufacturing display panel using anisotropic conductive film', inventors: ['H. Lee', 'S.-Y. Min', 'J. Yoon'], self: 1, number: 'CN 110000404 B', office: 'CNIPA', date: '2022-11-22', year: 2022, status: 'granted' },
        { title: 'Modular display device and tiling method thereof', inventors: ['S.-Y. Min', 'Y. Jung'], self: 0, number: 'US 2022/0000505 A1', office: 'USPTO', date: '2022-05-03', year: 2022, status: 'filed' }
      ],
      dom: [
        { title: 'Micro-LED display and repair method thereof', inventors: ['S.-Y. Min', 'J. Park'], self: 0, number: 'KR 10-2000101', office: 'KIPO', date: '2023-12-01', year: 2023, status: 'granted' },
        { title: 'Bonding apparatus for display modules', inventors: ['K. Choi', 'S.-Y. Min'], self: 1, number: 'KR 10-2023-0000202', office: 'KIPO', date: '2023-04-14', year: 2023, status: 'filed' },
        { title: 'Display device including light-emitting diode array', inventors: ['S.-Y. Min', 'M. Song', 'D. Lee'], self: 0, number: 'KR 10-1900303', office: 'KIPO', date: '2021-08-30', year: 2021, status: 'granted' }
      ]
    }
  };

  const people = (list, selfIdx) => list.map((name, i) => ({ name, self: i === selfIdx, other: i !== selfIdx, sep: i < list.length - 1 ? ', ' : '' }));

  function badge(label, solid, print) {
    if (print) return { label, bg: '#ffffff', fg: '#000000', border: solid ? '#000000' : '#8a8f96', weight: solid ? '700' : '600' };
    return solid
      ? { label, bg: '#3b6fb6', fg: '#ffffff', border: '#3b6fb6', weight: '600' }
      : { label, bg: 'transparent', fg: '#2f5f9e', border: '#9db8df', weight: '600' };
  }

  function view(opts) {
    const { lang = 'en', idp = '', print = false } = opts || {};
    const L = LABELS[lang], D = DATA, C = D.counts;
    const paper = (p, i) => ({ ...p, n: i + 1, people: people(p.authors, p.self), meta: `${p.venue} ${p.vol}, ${p.pages} (${p.year})`, doiUrl: 'https://doi.org/' + p.doi, hasDoi: true,
      badges: [p.first && badge(L.firstAuthor, true, print), p.corr && badge(L.corresponding, false, print)].filter(Boolean) });
    const patent = (p, i) => ({ ...p, n: i + 1, people: people(p.inventors, p.self), meta: `${p.number} · ${p.office} · ${p.date}`, doi: '', doiUrl: '', hasDoi: false,
      badges: [badge(p.status === 'granted' ? L.granted : L.filed, p.status === 'granted', print)] });
    const grp = (key, label, count, items, isPaper) => ({ key, anchor: idp + key, label, count: String(count),
      unit: isPaper ? L.paper : L.patent, unitPl: isPaper ? L.papers : L.patentsUnit,
      countLabel: `${count} ${isPaper ? L.papers : L.patentsUnit}`, items });
    const groups = [
      grp('intl-papers', L.intlPapers, C.intlPapers, D.papers.intl.map(paper), true),
      grp('dom-papers', L.domPapers, C.domPapers, D.papers.dom.map(paper), true),
      grp('intl-patents', L.intlPatents, C.intlPatents, D.patents.intl.map(patent), false),
      grp('dom-patents', L.domPatents, C.domPatents, D.patents.dom.map(patent), false)
    ];
    const blocks = [
      { key: 'publications', id: idp + 'publications', label: L.publications, groups: groups.slice(0, 2) },
      { key: 'patents', id: idp + 'patents', label: L.patents, groups: groups.slice(2) }
    ];
    const sec = (key, extra) => ({ key, id: idp + key, label: L[key], isEntries: false, isTags: false, isRows: false, ...extra });
    const sections = [
      sec('experience', { isEntries: true, entries: D.experience.map(e => ({ title: e.role, sub: e.org, period: e.period, bullets: e.bullets })) }),
      sec('education', { isEntries: true, entries: D.education.map(e => ({ title: e.degree, sub: e.org, period: e.period, bullets: e.note ? [e.note] : [] })) }),
      sec('interests', { isTags: true, tags: D.interests }),
      sec('projects', { isEntries: true, entries: D.projects.map(p => ({ title: p.title, sub: p.sponsor, period: p.period, bullets: [p.role] })) }),
      sec('skills', { isRows: true, rows: D.skills.map(s => ({ k: s.group, v: s.items.join(', '), sub: '', hasSub: false })) }),
      sec('awards', { isRows: true, rows: D.awards.map(a => ({ k: a.year, v: a.title, sub: a.org, hasSub: true })) })
    ];
    const metrics = [
      { value: String(C.papers), label: L.mPapers }, { value: String(C.firstAuthor), label: L.mFirst },
      { value: String(C.patentsFiled), label: L.mFiled }, { value: String(C.patentsGranted), label: L.mGranted }
    ];
    const jumps = groups.map((g, i) => ({ num: '0' + (i + 1), label: g.label, count: g.count, unit: g.unitPl, href: '#' + g.anchor }));
    const nav = [
      { label: L.profile, href: '#' + idp + 'profile' }, { label: L.summary, href: '#' + idp + 'summary' },
      ...sections.map(s => ({ label: s.label, href: '#' + s.id })),
      ...blocks.map(b => ({ label: b.label, href: '#' + b.id }))
    ];
    return { L, p: D.person, profile: D.profile, metrics, jumps, sections, blocks, nav, ids: { profile: idp + 'profile', summary: idp + 'summary' }, summaryHref: '#' + idp + 'summary' };
  }

  // Resolve the photo once; '' → placeholder is shown instead.
  let photoSrc = null; const waiters = [];
  fetch(DATA.person.photo, { method: 'HEAD' }).then(r => r.ok ? DATA.person.photo : '').catch(() => '')
    .then(src => { photoSrc = src; waiters.splice(0).forEach(f => f(src)); });
  const onPhoto = f => photoSrc === null ? waiters.push(f) : f(photoSrc);
  window.CV = { LABELS, DATA, view, onPhoto };
})();
