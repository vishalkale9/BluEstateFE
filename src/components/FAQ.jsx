import React from 'react';

const FAQ = () => {
    const faqData = [
        {
            id: "collapseOne",
            question: "What is tokenized real estate?",
            answer: "Tokenized real estate is the process of dividing a property into digital tokens using blockchain technology. Each token represents a fractional share of ownership in the underlying asset, allowing you to invest in high-value properties without needing millions of dollars."
        },
        {
            id: "collapseTwo",
            question: "How much can I invest?",
            answer: "Our platform is designed for accessibility. You can start investing with as little as $100. There are no maximum limits for verified investors, allowing you to build a diversified portfolio at your own pace."
        },
        {
            id: "collapseThree",
            question: "How do I earn returns?",
            answer: "Investors earn returns through two primary channels: monthly rental distributions (passive income) and potential capital appreciation if the property value increases over time."
        },
        {
            id: "collapseFour",
            question: "Can I sell my tokens anytime?",
            answer: "Yes. One of the biggest advantages of tokenization is liquidity. You can list your tokens for sale on our secondary marketplace 24/7, allowing you to exit your position much faster than traditional real estate."
        },
        {
            id: "collapseFive",
            question: "What types of properties are available?",
            answer: "We offer a diverse range of institutional-grade properties, including commercial office spaces, residential apartment complexes, medical centers, and industrial warehouses."
        },
        {
            id: "collapseSix",
            question: "How are properties selected?",
            answer: "Our expert real estate team performs rigorous due diligence on every asset, analyzing location growth, tenant history, structural integrity, and financial performance before a property is approved for the platform."
        },
        {
            id: "collapseSeven",
            question: "What happens if a property is sold?",
            answer: "If the underlying physical property is sold, the proceeds are distributed proportionally to all token holders after settlement, reflecting their percentage of ownership."
        },
        {
            id: "collapseEight",
            question: "Are there any fees?",
            answer: "We believe in transparency. There is a small acquisition fee when a property is first tokenized and a minor management fee to cover property maintenance and tenant relations, all of which are clearly disclosed for each asset."
        },
        {
            id: "collapseNine",
            question: "How do I get started?",
            answer: "Simply create an account on BluEstate, verify your identity, connect your wallet or fund your account, and browse our 'Explore Assets' section to make your first investment!"
        }
    ];

    return (
        <section className="py-5 bg-light" id="faq">
            <div className="container py-4">
                <div className="row mb-5 text-center">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="fw-bold display-5 text-dark mb-3">Frequently Asked Questions</h2>
                        <p className="text-muted lead">
                            Get answers to common questions about tokenized real estate investment and how our platform works.
                        </p>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="accordion accordion-flush shadow-sm rounded-4 overflow-hidden" id="faqAccordion">
                            {faqData.map((item, index) => (
                                <div className="accordion-item border-bottom" key={index}>
                                    <h2 className="accordion-header" id={`heading${item.id}`}>
                                        <button
                                            className="accordion-button collapsed fw-semibold py-4 px-4"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#${item.id}`}
                                            aria-expanded="false"
                                            aria-controls={item.id}
                                        >
                                            {item.question}
                                        </button>
                                    </h2>
                                    <div
                                        id={item.id}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading${item.id}`}
                                        data-bs-parent="#faqAccordion"
                                    >
                                        <div className="accordion-body text-muted px-4 pb-4">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
