$(function () {

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
<div class="carousel-item ${isActive}">
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
</div>
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


function createCard(video) {
    const { thumb_url, title, sub_title, author_pic_url, author, duration, star } = video;

    const stars = Array.from({ length: 5 }, (_, i) =>
        `<img src="images/star_${i < star ? 'on' : 'off'}.png" alt="star ${i < star ? 'on' : 'off'}" width="15px" height="15px">`
    ).join('');

    const cardHTML = `
          <div class="col-12 col-sm-6 col-md-4 card-deck">
            <div class="card border-0 d-flex flex-column">
              <div class="thumbnail-container position-relative">
                <img src="${thumb_url}" alt="Video thumbnail" class="card-img-top">
                <div class="card-img-overlay text-center">
                  <img src="images/play.png" alt="Play Button" width="64px" class="align-self-center play-overlay">
                </div>
              </div>
              <div class="card-body px-2">
                <h5 class="card-title font-weight-bold">${title}</h5>
                <p class="card-text text-muted">${sub_title}</p>
                <div class="creator d-flex align-items-center">
                  <img src="${author_pic_url}" alt="Author" style="width: 30px" class="rounded-circle">
                  <h6 class="pl-3 m-0 main-color">${author}</h6>
                </div>
                <div class="info pt-3 d-flex justify-content-between">
                  <div class="rating d-flex">${stars}</div>
                  <span class="main-color">${duration}</span>
                </div>
              </div>
            </div>
          </div>
        `;

    return $(cardHTML);
}

async function populateSection(carouselSelector, url, prevArrow, nextArrow) {
    const loader = $('.loader');
    loader.show();

    try {
        const response = await fetch(url);
        const data = await response.json();
        loader.hide();
        $(carouselSelector).empty();

        console.log(`Data fetched for ${carouselSelector}:`, data);

        data.forEach(video => {
            const card = createCard(video);
            $(carouselSelector).append(card);
        });

        $(carouselSelector).slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: prevArrow,
            nextArrow: nextArrow,
            responsive: [
                {
                    breakpoint: 769,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });

        $(prevArrow).removeClass("slick-hidden");
        $(nextArrow).removeClass("slick-hidden");
    } catch (error) {
        console.error("Failed to fetch data: ", error);
        loader.hide();
    }
}

$(document).ready(function () {
    console.log("Document is ready");

    populateSection('.carousel-inner.carousel-popular', "https://smileschool-api.hbtn.info/popular-tutorials", '.slick-prev-popular', '.slick-next-popular');
    populateSection('.carousel-inner.carousel-latest', 'https://smileschool-api.hbtn.info/latest-videos', '.slick-prev-latest', '.slick-next-latest');
});


const adjustCarouselMovement = (id) => {
    const $items = $(`#${id} .carousel-item`);
    $items.each(function () {
        let $item = $(this);
        let minPerSlide = 4;
        let $next = $item.next();
        if (!$next.length) {
            $next = $item.siblings(":first");
        }
        $next.children(":first-child").clone().appendTo($item);

        for (let i = 0; i < minPerSlide; i++) {
            $next = $next.next();
            if (!$next.length) {
                $next = $item.siblings(":first");
            }
            $next.children(":first-child").clone().appendTo($item);
        }
    });
};

function createCourseCard(course) {
    const { thumb_url, title, 'sub-title': sub_title, author_pic_url, author, duration, star } = course;

    const stars = Array.from({ length: 5 }, (_, i) =>
        `<img src="images/star_${i < star ? 'on' : 'off'}.png" alt="star ${i < star ? 'on' : 'off'}" width="15px" height="15px">`
    ).join('');

    const cardHTML = `
        <div class="col-12 col-sm-6 col-md-3 card-deck">
            <div class="card border-0 d-flex flex-column">
                <div class="thumbnail-container position-relative">
                    <img src="${thumb_url}" alt="Video thumbnail" class="card-img-top">
                    <div class="card-img-overlay text-center">
                        <img src="images/play.png" alt="Play Button" width="64px" class="align-self-center play-overlay">
                    </div>
                </div>
                <div class="card-body px-2">
                    <h5 class="card-title font-weight-bold">${title}</h5>
                    <p class="card-text text-muted">${sub_title}</p>
                    <div class="creator d-flex align-items-center">
                        <img src="${author_pic_url}" alt="Author" width="30px" class="rounded-circle">
                        <h6 class="pl-3 m-0 main-color">${author}</h6>
                    </div>
                    <div class="info pt-3 d-flex justify-content-between">
                        <div class="rating d-flex">${stars}</div>
                        <span class="main-color">${duration}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    return $(cardHTML);
}

function updateSelections(data) {

    if (data.topics.length > 0) {
        $('.box2 .btn span').text(data.topics[0]);
    }

    if (data.sorts.length > 0) {
        $('.box3 .btn span').text(data.sorts[0]);
    }
}

function populateCourses(coursesSelector, url, query = '', topic = 'all', sort = 'most_popular') {
    const loader = $('.loader');
    loader.show();

    $.get(url, { q: query, topic: topic, sort: sort }, function (data) {
        loader.hide();
        $(coursesSelector).empty();

        console.log(`Data fetched for ${coursesSelector}: `, data);


        $('#keywords').val(data.q);


        $('.box2 .dropdown-menu').html('');
        data.topics.forEach(topic => {
            $('.box2 .dropdown-menu').append(`<a class="dropdown-item" href="#">${topic}</a>`);
        });

        $('.box3 .dropdown-menu').html('');
        data.sorts.forEach(sort => {
            $('.box3 .dropdown-menu').append(`<a class="dropdown-item" href="#">${sort}</a>`);
        });

        updateSelections(data);

        $('#section-title').html(`<span class="text-muted video-count">${data.courses.length} videos</span>`);

        data.courses.forEach((course, index) => {
            const card = createCourseCard(course);
            $(coursesSelector).append(card);
        });


        $('.box2 .dropdown-item').on('click', function (e) {
            e.preventDefault();
            $('.box2 .btn span').text($(this).text());
            populateCourses('#courses-list', coursesApiUrl, $('.search-text-area').val(), $(this).text(), $('.box3 .btn span').text());
        });

        $('.box3 .dropdown-item').on('click', function (e) {
            e.preventDefault();
            $('.box3 .btn span').text($(this).text());
            populateCourses('#courses-list', coursesApiUrl, $('.search-text-area').val(), $('.box2 .btn span').text(), $(this).text());
        });
    });
}

$(document).ready(function () {
    console.log("Document is ready");

    const coursesApiUrl = "https://smileschool-api.hbtn.info/courses";

    populateCourses('#courses-list', coursesApiUrl);

    $('.search-text-area').on('change', function () {
        populateCourses('#courses-list', coursesApiUrl, $(this).val(), $('.box2 .btn span').text(), $('.box3 .btn span').text());
    });
});
