import React, { useState, useEffect } from "react";
import Slider from "react-slick";

function CustomPaging({ id }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8080/admin/getproduct/${id}`);


        const data = await response.json();
        console.log(data);
        

        if (data.success && data.product?.images?.length) {
          setImages(data.product.images);
        } else {
          throw new Error("Product images not available");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2 className="text-center">Loading images...</h2>;
  if (error) return <h2 className="text-center text-danger">Error: {error}</h2>;
  if (!images.length) return <h2 className="text-center">No images available</h2>;

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img
            style={{ width: "100%", height: "80px", objectFit: "cover" }}
            src={`http://localhost:8080/image_product/${images[i]}`}
            alt={`Thumbnail ${i + 1}`}
          />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              src={`http://localhost:8080/image_product/${image}`}
              alt={`Product Slide ${index + 1}`}
              className="img-fluid"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomPaging;