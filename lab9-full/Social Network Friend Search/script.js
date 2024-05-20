document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const userCards = document.getElementById('user-cards');
    const logout = document.getElementById('logout');

    let users = [];
    let filteredUsers = [];
    let currentPage = 1;
    const usersPerPage = 10;
    let sortCriteria = '';
    let filterCriteria = '';
    let isFetching = false;

    logout.addEventListener('click', handleLogout);
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('scroll', handleScroll);

    fetchUsers();

    function handleLogout() {
        window.location.href = '../AuthorizationNRegistration/index.html';
    }

    function handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        filteredUsers = filterUsers(users, query);
        currentPage = 1;
        updateURL();
        displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
    }

    function handleDocumentClick(e) {
        if (e.target.matches('#sort-age')) {
            sortCriteria = 'age';
            filteredUsers.sort((a, b) => a.dob.age - b.dob.age);
            currentPage = 1;
            updateURL();
            displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
        } else if (e.target.matches('#sort-name')) {
            sortCriteria = 'name';
            filteredUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
            currentPage = 1;
            updateURL();
            displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
        } else if (e.target.matches('#filter-male')) {
            filterCriteria = 'male';
            filteredUsers = users.filter(user => user.gender === 'male');
            currentPage = 1;
            updateURL();
            displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
        } else if (e.target.matches('#filter-female')) {
            filterCriteria = 'female';
            filteredUsers = users.filter(user => user.gender === 'female');
            currentPage = 1;
            updateURL();
            displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
        } else if (e.target.matches('#reset-filters')) {
            filterCriteria = '';
            filteredUsers = users;
            currentPage = 1;
            updateURL();
            displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
        }
    }

    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching) {
            currentPage++;
            isFetching = true;
            displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
            isFetching = false;
        }
    }

    function fetchUsers() {
        fetch('https://randomuser.me/api/?results=50')
            .then(response => response.json())
            .then(data => {
                users = data.results;
                filteredUsers = users;
                const {query, sort, filter} = getURLParams();
                if (query) {
                    searchInput.value = query;
                    filteredUsers = filterUsers(users, query);
                }
                if (sort) {
                    sortCriteria = sort;
                    if (sortCriteria === 'age') {
                        filteredUsers.sort((a, b) => a.dob.age - b.dob.age);
                    } else if (sortCriteria === 'name') {
                        filteredUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
                    }
                }
                if (filter) {
                    filterCriteria = filter;
                    if (filterCriteria === 'male') {
                        filteredUsers = users.filter(user => user.gender === 'male');
                    } else if (filterCriteria === 'female') {
                        filteredUsers = users.filter(user => user.gender === 'female');
                    }
                }
                displayUsers(filteredUsers.slice(0, currentPage * usersPerPage));
            });
    }

    function displayUsers(users) {
        if (currentPage === 1) {
            userCards.innerHTML = '';
        }
        users.forEach(user => {
            const {picture, name, dob, email, location, phone} = user;
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <img src="${picture.large}" alt="${name.first}">
                <h3>${name.first} ${name.last}</h3>
                <p>Age: ${dob.age}</p>
                <p>Email: ${email}</p>
                <p>Location: ${location.city}, ${location.country}</p>
                <p>Phone: ${phone}</p>
            `;
            userCards.appendChild(userCard);
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function updateURL() {
        const query = searchInput.value;
        const urlParams = new URLSearchParams();
        if (query) {
            urlParams.set('query', query);
        }
        if (sortCriteria) {
            urlParams.set('sort', sortCriteria);
        }
        if (filterCriteria) {
            urlParams.set('filter', filterCriteria);
        }
        history.pushState(null, '', '?' + urlParams.toString());
    }

    function getURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            query: urlParams.get('query'),
            sort: urlParams.get('sort'),
            filter: urlParams.get('filter')
        };
    }

    function filterUsers(users, query) {
        return users.filter(({name, location, email}) => {
            return name.first.toLowerCase().includes(query) ||
                name.last.toLowerCase().includes(query) ||
                location.city.toLowerCase().includes(query) ||
                location.country.toLowerCase().includes(query) ||
                email.toLowerCase().includes(query);
        });
    }
});
