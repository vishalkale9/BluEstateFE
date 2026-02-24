import React from 'react';
import FeatureCard from './FeatureCard';

const WhyChooseUs = () => {
    const features = [
        {
            icon: "bi-graph-up-arrow",
            title: "High Yields",
            description: "Earn strong returns on real estate with clear performance data and transparent metrics."
        },
        {
            icon: "bi-shield-check",
            title: "Secure & Regulated",
            description: "Bank-grade security with full regulatory compliance. Your investments are protected."
        },
        {
            icon: "bi-arrow-left-right",
            title: "Instant Liquidity",
            description: "Buy and sell fractions anytime on our 24/7 secondary marketplace."
        },
        {
            icon: "bi-cash-coin",
            title: "Low Minimums",
            description: "Start investing with as little as $100. No large capital requirements."
        },
        {
            icon: "bi-globe",
            title: "Global Properties",
            description: "Access premium real estate across multiple markets and property types."
        },
        {
            icon: "bi-person-badge",
            title: "Professional Management",
            description: "Expert property management handles everything from maintenance to tenant relations."
        }
    ];

    return (
        <section className="py-5 bg-white border-top border-bottom" id="why-us">
            <div className="container py-4">
                <div className="row text-center mb-5">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="fw-bold display-5 text-dark mb-3">Why choose BlocEstate?</h2>
                        <p className="text-muted lead">
                            Built for the modern investor with institutional-grade technology and retail accessibility.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
