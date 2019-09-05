// Background color
var image_1 = 'https://www.aljazeera.com/mritems/images/2014/7/30/20147301019304164_8.jpg';
var image_2 = 'https://www.aljazeera.com/mritems/images/2014/7/30/2014730101928536746_8.jpg';
var image_3 = 'https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/9/7/4/1/961479-3-eng-GB/IPCA-Laboratories-will-not-supply-anti-malaria-meds-to-the-Global-Fund_wrbm_large.jpg';

var intro_1 = `<p>Malaria is a serious and sometimes fatal disease caused by a parasite that commonly 
infects a certain type of mosquito which feeds on humans. <br> People who get malaria 
are typically very sick with high fevers, shaking chills, and flu-like illness.</p>`;

var intro_2 = `<p>The World Health Organization (WHO) estimates that 438,000 people died because of 
malaria in 2015; the Institute of Health Metrics and Evaluation (IHME), Global Burden 
of Disease (GBD) puts this estimate at 620,000 in 2017. Children under five and  
pregnant women are particularly vulnerable to Malaria.<p>`;

var intro_3 = `<p>While Malaria could be life threatening, it is also preventable and treatable.
Common preventive methods include using bite prevention, taking anti-malaria pills, 
and early diagnosis.A Malaria vaccine is going through clinial trials in multiple countries to provide protection from the parasite. <p>`;


var images = new Array(image_1,image_2,image_3);
var introductions = new Array(intro_1,intro_2,intro_3);

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;

  var dots = document.getElementsByClassName("dot");
  if (n > images.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = images.length}
  
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" dot-active", "");
  }

  $("#background")
        .attr("style", "background-image: url("+images[slideIndex-1]+");background-size: 100%; height: 100%;");

  $("#introduction")
        .html(introductions[slideIndex-1]);

  dots[slideIndex-1].className += " dot-active";

}


