export default function Testimonals({ testimonials }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name || "Student"}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <p className="text-gray-600 italic mb-4">&ldquo;{testimonial.content || testimonial.text}&rdquo;</p>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}