$(function() {

    const generateCarouselItems = (data, containerId, isQuote = true) => {
        const $container = $(`#${containerId}`);
        data.forEach((item, index) => {
            const isActive = index === 0 ? 'active' : '';
            const $item = isQuote ? createQuoteItem(item, isActive) : createVideoItem(item, isActive);
            $container.append($item);
        });
    };

    // Creates carousel for quotes
    const createQuoteItem = (data, isActive) => $(`
        <blockquote class="carousel-item ${isActive}">
            <div class="row mx-auto align-items-center">
                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                    <img src="${data.pic_url}" class="d-block align-self-center" alt="Carousel Pic" />
                </div>
                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                    <div class="quote-text">
                        <p class="text-white pr-md-4 pr-lg-5">${data.text}</p>
                        <h4 class="text-white font-weight-bold">${data.name}</h4>
                        <span class="text-white">${data.title}</span>
                    </div>
                </div>
            </div>
        </blockquote>
    `);

    const fetchData = (url, successCallback) => {
        $.ajax({
            url,
            method: 'GET',
            success: (data) => {
                setTimeout(() => {
                    const loader = document.getElementById('loader');
                    if (loader) {
                        loader.classList.add('loader-is-active');
                    }
                }, 2000);
                successCallback(data);
            },
            error: () => alert(`Error fetching data from ${url}`),
            beforeSend: () => $('#loader').show(),
            complete: () => $('#loader').hide(),
        });
    };

    if ($('#carousel-items').length) {
        fetchData('https://smileschool-api.hbtn.info/quotes', (data) => {
            generateCarouselItems(data, 'carousel-items', true);
        });
    }
});
