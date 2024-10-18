import React from "react";
import Footer from "./Footer";

const AboutUs = () => {
    return (
    <>
        <br />
        <br />
        
        <div className="flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-center mb-8 max-w-4xl">
                We are a team of passionate professionals dedicated to providing you with the best
                clothing shopping experience. Our goal is to create stylish and high-quality pieces
                that bring joy to your everyday life. We value each customer and are always ready to
                assist you in finding the perfect outfit.
            </p>
            
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-xl text-center mb-8 max-w-4xl">
                Our mission is to offer stylish and affordable clothing, allowing you to feel confident
                and comfortable in any situation. We care about quality and strive to keep up with the
                latest fashion trends, ensuring that you have access to the best styles available.
            </p>
            
            <h2 className="text-3xl font-semibold mb-4">Our Values</h2>
            <p className="text-xl text-center mb-8 max-w-4xl">
                We believe in sustainability and ethical practices. Our team works hard to source materials
                responsibly and partner with manufacturers who share our commitment to ethical labor
                standards. We aim to make a positive impact on the fashion industry and the environment.
            </p>
            
            <h2 className="text-3xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-xl text-center mb-8 max-w-4xl">
                We invite you to join our community of fashion enthusiasts! Follow us on social media
                for the latest updates, style tips, and exclusive offers. Together, let's celebrate
                individuality and creativity in fashion.
            </p>
            
            {/* New Sections */}
            <h2 className="text-3xl font-semibold mb-4">Meet Our Team</h2>
            <p className="text-xl text-center mb-8 max-w-4xl">
                Our diverse team brings together a wealth of experience and creativity, united by a love for fashion.
                Each member contributes their unique perspective, ensuring we deliver the best to our customers.
            </p>
            <h2 className="text-3xl font-semibold mb-4">Customer Testimonials</h2>
            <p className="text-xl text-center mb-8 max-w-4xl">
                "I've never felt more confident in my outfits! The quality is unmatched." - Jane D.
            </p>
            <p className="text-xl text-center mb-8 max-w-4xl">
                "A fantastic shopping experience with great customer service!" - Mark S.
            </p>
            <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
            <p className="text-xl text-center mb-8 max-w-4xl">
                Have questions? Reach out to us at support@gmail.com or visit our contact page for more options.
            </p>
        </div>
        <Footer />
    </>
    );
}

export default AboutUs;