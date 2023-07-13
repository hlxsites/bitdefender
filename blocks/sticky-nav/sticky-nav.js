// import { setActiveLink } from '../../scripts/lib-franklin.js';

export default function decorate(block) {

   /* set active section */
   // const links = block.querySelectorAll('a');
   // setActiveLink(links, 'active');

   /* change to ul, li and divs to match original css */
   const wc_div = document.createElement('div');
   wc_div.className = 'we-container';

   const outer_div = document.createElement('div');
   outer_div.className = 'outer';
   wc_div.append(outer_div)

   const innder_div = document.createElement('div');
   innder_div.className = 'inner-wrapper';
   outer_div.append(innder_div)

   const ul = document.createElement('ul');
   [...block.children[0].children].forEach((row) => {
     const li = document.createElement('li');
     const a = row.querySelector('a');
     const span = document.createElement('span');
     span.innerHTML = a.innerHTML;
     a.innerHTML = '';
     a.append(span);
     li.append(a);
   //   [...li.children].forEach((div) => {
   //     if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
   //     else div.className = 'cards-card-body';
   //   });
     ul.append(li);
   });
   // ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
   innder_div.append(ul);

   block.textContent = '';
   block.classList.add('moreItems');
   block.append(wc_div);

   document.addEventListener('scroll', () => {
      const wrapper_top = block.parentElement.offsetTop - 10;
      if(window.scrollY >= wrapper_top) {
         block.classList.add('fixed-nav')
      } else {
         block.classList.remove('fixed-nav')
      }

    });

   // e("section.sticky-nav").offset().top - 10;

//    e(window).scroll((function() {
//       e(window).scrollTop() >= r ? (e("section.sticky-nav").addClass("fixed-nav"),
//       e(".main-header").addClass("scrolling_down")) : (e("section.sticky-nav").removeClass("fixed-nav"),
//       e(this).scrollTop() > 1 && e(".main-header").addClass("scrolling_up"))
//   }
//   )),
}


// function Ut() {
//    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : jQuery;
//    function t() {
//        var t = e(".sticky-nav").outerHeight();
//        e(window).on("scroll", (function() {
//            var r = e(window).scrollTop()
//              , a = e("section")
//              , o = e(".sticky-nav ul");
//            if (a.each((function() {
//                var a = e(this).offset().top - 100
//                  , n = a + e(this).outerHeight();
//                r >= a && r <= n ? (o.find("li.active").siblings("li.active").removeClass("active").removeClass("selected"),
//                o.find('a[href="#' + e(this).attr("id") + '"]').parent("li").addClass("active").addClass("selected"),
//                o.find('a[href="#' + e(this).attr("id") + '"]').parent("li.active").clone().appendTo(".mobile-option")) : (r >= n || r < e(".sticky-nav").offset().top - t) && (o.find("li.active").removeClass("active").removeClass("selected"),
//                e(".mobile-option").empty())
//            }
//            )),
//            !e(".mobile-option").html())
//                return e(".sticky-nav ul li:first-of-type").clone().appendTo(".mobile-option"),
//                !1
//        }
//        )),
//        e('.sticky-nav li a[href^="#"]').on("click", (function(r) {
//            r.preventDefault();
//            e(this).attr("href");
//            e("html, body").animate({
//                scrollTop: e(e(this).attr("href")).offset().top - t
//            }, 1e3, "linear")
//        }
//        )),
//        e('.sticky-nav .btn-wrap a[href^="#"]').on("click", (function(t) {
//            t.preventDefault(),
//            e("html, body").animate({
//                scrollTop: e(e(this).attr("href")).offset().top
//            }, 1e3, "linear"),
//            e(".sticky-nav .outer").removeClass("open")
//        }
//        ))
//    }
//    e(document).ready((function() {
//        if (e("section.sticky-nav").length > 0) {
//            e(".sticky-nav ul li a").on("click", (function(t) {
//                t.preventDefault(),
//                e(".sticky-nav ul li").removeClass("active"),
//                e(this).parent().addClass("active"),
//                e(".sticky-nav .outer").removeClass("open"),
//                e(".mobile-option").empty(),
//                e(this).parent().clone().appendTo(".mobile-option"),
//                e(".sticky-nav ul li").removeClass("selected"),
//                e(this).parent().addClass("selected");
//                var r = e(this).attr("href");
//                -1 == r.indexOf("#") && window.open(r, "_blank")
//            }
//            ));
//            var r = e("section.sticky-nav").offset().top - 10;
//            e("section.sticky-nav").find(".btn-wrap").length <= 0 && e("section.sticky-nav").addClass("no-btn"),
//            e(window).scroll((function() {
//                e(window).scrollTop() >= r ? (e("section.sticky-nav").addClass("fixed-nav"),
//                e(".main-header").addClass("scrolling_down")) : (e("section.sticky-nav").removeClass("fixed-nav"),
//                e(this).scrollTop() > 1 && e(".main-header").addClass("scrolling_up"))
//            }
//            )),
//            t(),
//            e(".sticky-nav ul li").first().addClass("selected").siblings().removeClass("selected"),
//            e(".mobile-option").on("click", (function(t) {
//                t.preventDefault(),
//                e(this).parent().toggleClass("open")
//            }
//            )),
//            e(".sticky-nav ul li").length > 6 && e("section.sticky-nav").addClass("moreItems"),
//            e(".sticky-nav .btn-wrap a").length > 1 && e("section.sticky-nav").addClass("moreBtn"),
//            e("section.sticky-nav .inner-wrapper li").length > 5 && e("section.sticky-nav").addClass("moreBtnItems"),
//            e("section.sticky-nav .inner-wrapper li").length > 4 && e("section.sticky-nav .btn-wrap a").length > 1 && e("section.sticky-nav").addClass("moreBtnItems"),
//            e(".sticky-nav").css("opacity", "1")
//        }
//    }
//    )),
//    e(window).resize((function() {
//        e(".sticky-nav .outer").removeClass("open"),
//        e('.sticky-nav .btn-wrap a[href^="#"]').on("click", (function() {
//            e(".sticky-nav .outer").removeClass("open")
//        }
//        ))
//    }
//    )),
//    setTimeout((function() {
//        0 === e("section.sticky-nav.moreItems .btn-wrap a").length && e("section.sticky-nav.moreItems").addClass("full-width")
//    }
//    ), 500)
// }