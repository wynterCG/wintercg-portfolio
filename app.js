const { useState, useEffect, useMemo } = React;

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('artstation.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error('Fetch error', err);
      }
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter(item => {
      const matchSearch = !term || item.title.toLowerCase().includes(term) ||
        (Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(term)));
      const matchFilter = filter === 'All' || item.category === filter;
      return matchSearch && matchFilter;
    });
  }, [items, filter, search]);

  return React.createElement('div', { className: 'container' },
    React.createElement('header', { className: 'header' },
      React.createElement('h1', null, 'WinterCG Portfolio'),
      React.createElement('p', null, 'ArtStation Projects'),
      React.createElement('div', { className: 'controls' },
        React.createElement('select', { value: filter, onChange: e => setFilter(e.target.value) },
          React.createElement('option', { value: 'All' }, 'All'),
          React.createElement('option', { value: 'Games' }, 'Games'),
          React.createElement('option', { value: 'Archviz' }, 'Archviz'),
          React.createElement('option', { value: 'Materials' }, 'Materials')
        ),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search...',
          value: search,
          onChange: e => setSearch(e.target.value)
        })
      )
    ),
    React.createElement('div', { className: 'grid' },
      filtered.map(item =>
        React.createElement('div', { key: item.id, className: 'card' },
          React.createElement('img', { src: item.image, alt: item.title }),
          React.createElement('h3', null, item.title),
          React.createElement('p', null, item.category),
          React.createElement('a', { href: item.link, target: '_blank' }, 'View')
        )
      )
    ),
    React.createElement('footer', { className: 'footer' },
      React.createElement('p', null, 'Powered by ArtStation and GitHub Pages.')
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
