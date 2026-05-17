export const COM_TYPES = [
  { id: 'com_office', icon: '🏢', label: 'Ofis' },
  { id: 'com_restaurant', icon: '🍽️', label: 'Restoran' },
  { id: 'com_coffee', icon: '☕', label: 'Kafe' },
  { id: 'com_boutique', icon: '👕', label: 'Butik' },
  { id: 'com_industrial', icon: '🏭', label: 'Sanayi/Depo' }
];

export const PROMPT_MODULES = {
  upscale: {
    pos: "Recover original surface micro-details, eliminate ISO noise, and restore native material integrity with 100% pixel fidelity.",
    neg: ["hallucinated details", "pixelated texture", "artificial sharpening"]
  },
  privacy: {
    pos: "High-end editorial shielding: strategically defocus license plates, faces, and personal documents while preserving depth-of-field.",
    neg: ["black censor bars", "obvious censorship boxes", "aggressive smudging"]
  },
  expand: {
    pos: "Flawless rectilinear outpainting: extend the scene geometry with perfect perspective matching and seamless light falloff.",
    neg: ["cloned windows", "repetitive patterns", "mirrored architecture", "geometric echoes"]
  },
  lifestyle: {
    pos: "High-end interior styling: if empty, furnish with minimalist designer pieces; if occupied, add realistic lived-in elements like organic linen throws and subtle lifestyle props to evoke emotional warmth.",
    neg: ["cluttered surfaces", "mismatched scale", "unnatural furniture placement", "people", "party scenes", "messy items"]
  },
  cleaning: {
    pos: "Deep surgical restoration: remove all floor debris, trash, messy cables, industrial stains, yard waste, and weeds. Restore pristine architectural textures and surfaces while maintaining 100% structural fidelity.",
    neg: ["added objects", "new furniture", "hallucinated structural elements", "extra architectural features"]
  },
  light: {
    pos: "Natural midday daylight: flood the scene with bright, diffused window light and realistic soft ambient occlusion.",
    neg: ["harsh flash shadows", "unnatural neon", "artificial studio lights"]
  },
  twilight: {
    pos: "Blue hour transition: apply a deep evening atmosphere with warm interior glows reflecting against the cool natural twilight.",
    neg: ["pitch black sky", "over-bright windows", "unnatural lens flare"]
  },
  removal: {
    pos: "Total furniture purge: surgically remove all existing items to reveal the raw architectural volume and natural light patterns.",
    neg: ["leftover fragments", "floating legs", "smudged floors", "distorted floor textures"]
  },
  drone: {
    pos: "Cinematic drone aerial photography: capture a sharp, geometrically symmetrical bird's-eye view with perfect property boundary clarity and aerial perspective.",
    neg: ["other drones", "birds", "thick clouds", "distorted horizon"]
  },
  floorplan: {
    pos: "Classic minimal architectural drawing conversion: render a clean technical site plan with clear structural lines and blueprint aesthetic.",
    neg: ["3D isometric perspective", "hand-drawn sketches", "messy labeling", "ultra-realistic render"]
  },
  com_office: {
    pos: (mode) => mode === 'outdoor' 
      ? "Corporate building facade restoration: render a high-end glass curtain wall architecture with modern signage and professional landscaping."
      : "Executive corporate interior: design a minimalist open-plan office with ergonomic designer furniture, glass partitions, and premium acoustic ceiling treatments.",
    neg: ["messy cables", "crowded desks", "residential furniture", "clutter"]
  },
  com_restaurant: {
    pos: (mode) => mode === 'outdoor' 
      ? "High-end bistro storefront: create an inviting restaurant facade with designer awnings, elegant outdoor seating, and warm editorial lighting."
      : "Fine-dining interior visualization: apply luxury materials like marble and dark wood, designer ambient lighting, and perfectly set professional dining tables.",
    neg: ["fast food vibe", "plastic chairs", "messy kitchen", "cheap lighting"]
  },
  com_coffee: {
    pos: (mode) => mode === 'outdoor' 
      ? "Charming artisanal coffee house exterior: render a cozy shopfront with wood accents, large windows, and stylish sidewalk chalkboards."
      : "Specialty coffee shop interior: create a warm industrial-chic atmosphere with a professional espresso bar, organic textures, and comfortable lounge seating.",
    neg: ["cluttered counter", "generic cafe look", "dark corners", "unorganized space"]
  },
  com_boutique: {
    pos: (mode) => mode === 'outdoor' 
      ? "Luxury fashion boutique storefront: render a high-end retail facade with large display windows, elegant branding, and minimalist architectural details."
      : "Premium retail interior styling: apply high-end lighting, elegant clothing displays, and a minimalist gallery-like atmosphere for luxury products.",
    neg: ["cluttered shop", "unnatural lighting", "messy racks", "bargain bins"]
  },
  com_industrial: {
    pos: (mode) => mode === 'outdoor' 
      ? "Modern logistics hub exterior: showcase a clean, expansive industrial facade with professional loading docks and organized heavy-vehicle access."
      : "High-tech industrial/warehouse interior: render a vast, clean floor space with high ceilings, professional LED lighting, and organized industrial racking.",
    neg: ["rust", "debris", "dark spots", "cluttered pallets", "industrial waste"]
  },
  neg_people: { neg: ["people", "faces", "humans", "man", "woman", "children"] },
  neg_text: { neg: ["text", "logo", "watermark", "signage", "characters"] }
};
