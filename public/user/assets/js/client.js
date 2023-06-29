document.getElementById('searchButton').addEventListener('keyup', searchProducts);

    function searchProducts() {
        const searchTerm = $('#searchButton').val();
        const url = `http://localhost:3000/serviceSearch?searchTerm=${encodeURIComponent(searchTerm)}`;

        $(function () {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                displaySearchResults(data);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    })
    }


    function displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = 'No products found.';
        } else {
            results.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('course-grid-3');
                productElement.innerHTML = `
                <!-- Start Single Card  -->
                <div class="rbt-card variation-01 rbt-hover">
                    <div class="rbt-card-img">
                        <a href="/productDetails?id=${product._id}">
                            <img src="admin/assets/ProductImages/${product.image}" alt="Youtube Cashcow image">
                        </a>
                    </div>
                    <div class="rbt-card-body">
                        <h4 class="rbt-card-title"><a href="/productDetails?id=${product._id}">${product.name}</a></h4>
                        <p class="rbt-card-text">${product.sdescription}</p>
                        <div class="rbt-card-bottom">
                            <div class="rbt-price">
                                <span class="current-price">$${product.discountedPrice}</span>
                                <span class="off-price">$${product.mrp}</span>
                            </div>
                            <a class="rbt-btn btn-sm btn-border radius-round-10" href="/addToCart?id=${product._id}">Add To Cart</a>
                        </div>
                    </div>
                </div>
                <!-- End Single Card  -->
            `;
                searchResults.appendChild(productElement);
            });
        }
    }

    document.getElementById('sortvalue').addEventListener('change', sortProduct)

    function sortProduct() {
        const sortvalue = $('#sortvalue').val();
        const url = `http://localhost:3000/sort?sortby=${encodeURIComponent(sortvalue)}`;
        $(function () {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                displaySearchResults(data);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    });
    }

