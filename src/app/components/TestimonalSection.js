'use client';
import React from 'react';

export default function TestimonalSection() {
  const testimonials = [
    {
      id: 1,
      name: "Juan Pérez",
      role: "Estudiante de Ingeniería",
      feedback:
        "InternHub me ayudó a encontrar prácticas increíbles que se alineaban con mis intereses profesionales. ¡Altamente recomendado!",
    },
    {
      id: 2,
      name: "María Gómez",
      role: "Estudiante de Diseño Gráfico",
      feedback:
        "La plataforma es fácil de usar y las oportunidades son variadas. Gracias a InternHub, conseguí una pasantía en una empresa líder.",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      role: "Estudiante de Marketing",
      feedback:
        "El proceso de aplicación fue sencillo y el soporte del equipo de InternHub fue excepcional. ¡Una experiencia fantástica!",
    },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Testimonios</h2>
      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border-l-4 border-blue-600 pl-4">
            <p className="italic text-gray-800">"{testimonial.feedback}"</p>
            <p className="mt-2 font-semibold text-gray-900">
              - {testimonial.name}, <span className="font-normal">{testimonial.role}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}