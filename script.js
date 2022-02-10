//'use strict';

const postContainer = document.querySelector('.posts');
const footer = document.querySelector('.p-card__footer');

// COMMENTS
// It is not 100% clear which value is needed to use as a value for header and footer of the post. In case of real work sutiation I would consult with the collegues. In this situation I have placed the most relevant data from JSON file provided.

const renderPost = function(data) {
    // Date manipulation
    const date = new Date(data.date);
    const dateModified = new Intl.DateTimeFormat('en-GB', { day: 'numeric',  month: 'long',  year: 'numeric' }).format(date);

    // Retrieve Topic and Category names for Header and Footer of the post. If there is no name, 'News' is put as a default value
    const topicNum = +data.topic;
    const categoryNum = +data.categories;
    const findEmbeddedID = function(value) {
        if (!(data._embedded['wp:term'].flatMap(obj => obj).find(obj => obj.id === value))) {
            return 'News';
        } else {
            const arr = data._embedded['wp:term'].flatMap(obj => obj).find(obj => obj.id === value);
            return arr.name;
        }}    
    const topic = findEmbeddedID(topicNum).toUpperCase();
    const category = findEmbeddedID(categoryNum);
    
    // html template
    const html = `
     <div class="col-4 u-equal-height">
        <div class="p-card p-card--muted ox-top-border ox-parent-flex">
            <div class="p-card__header p-card__inner u-no-padding--top ox-dotted-border-bottom">
                <p>${topic}</p>
            </div>
            <div class="p-card__content p-card__inner ox-child-flex">
                <img class="p-card__image" src="${data.featured_media}"></img>
                <h3 class="p-heading--4">
                    <a href="${data.link}">${data.title.rendered}</a>
                </h3>
                <h6>By <a href='${data._embedded.author[0].link}'>${data._embedded.author[0].name}</a> on ${dateModified}</h6>
            </div>   
            <div class="p-card__footer p-card__inner u-no-padding--bottom ox-dotted-border-top">
            <p>${category}</p>
            </div>
        </div>
    </div>
    ` 
;
    // Insert html into DOM
    postContainer.insertAdjacentHTML('beforeend', html);
    
}

// Fetch the data
const getPostData = function() {
    fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json')
    .then(response => response.json())
    .then(data => data.forEach(post => renderPost(post)))
    .catch(err => alert(err))
}

getPostData();
