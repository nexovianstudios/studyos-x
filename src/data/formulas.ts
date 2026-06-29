export interface Formula {
  id: string;
  subject: 'Mathematics' | 'Physics' | 'Chemistry';
  chapter: string;
  name: string;
  formula: string;
  description: string;
  variables?: string;
}

export const FORMULAS: Formula[] = [
  // ===== MATHEMATICS =====
  // Real Numbers
  { id: 'm-rn-1', subject: 'Mathematics', chapter: 'Real Numbers', name: 'HCF by Euclid', formula: 'a = bq + r, 0 ≤ r < b', description: 'Euclid\'s division lemma: any positive integer a can be divided by b to give quotient q and remainder r.', variables: 'a = dividend, b = divisor, q = quotient, r = remainder' },
  { id: 'm-rn-2', subject: 'Mathematics', chapter: 'Real Numbers', name: 'LCM × HCF', formula: 'LCM(a,b) × HCF(a,b) = a × b', description: 'Product of two numbers equals product of their LCM and HCF.' },
  { id: 'm-rn-3', subject: 'Mathematics', chapter: 'Real Numbers', name: 'LCM of fractions', formula: 'LCM = LCM(num)/HCF(den)', description: 'LCM of fractions = LCM of numerators / HCF of denominators.' },
  { id: 'm-rn-4', subject: 'Mathematics', chapter: 'Real Numbers', name: 'HCF of fractions', formula: 'HCF = HCF(num)/LCM(den)', description: 'HCF of fractions = HCF of numerators / LCM of denominators.' },

  // Polynomials
  { id: 'm-poly-1', subject: 'Mathematics', chapter: 'Polynomials', name: 'Quadratic roots', formula: 'x = [-b ± √(b²-4ac)] / 2a', description: 'Roots of ax² + bx + c = 0.', variables: 'a,b,c = coefficients' },
  { id: 'm-poly-2', subject: 'Mathematics', chapter: 'Polynomials', name: 'Sum of roots', formula: 'α + β = -b/a', description: 'Sum of roots of ax² + bx + c = 0.' },
  { id: 'm-poly-3', subject: 'Mathematics', chapter: 'Polynomials', name: 'Product of roots', formula: 'αβ = c/a', description: 'Product of roots of ax² + bx + c = 0.' },
  { id: 'm-poly-4', subject: 'Mathematics', chapter: 'Polynomials', name: 'Discriminant', formula: 'D = b² - 4ac', description: 'Determines nature of roots: D>0 two distinct real, D=0 equal, D<0 no real roots.' },
  { id: 'm-poly-5', subject: 'Mathematics', chapter: 'Polynomials', name: 'Remainder theorem', formula: 'p(a) = remainder', description: 'When p(x) is divided by (x-a), remainder = p(a).' },
  { id: 'm-poly-6', subject: 'Mathematics', chapter: 'Polynomials', name: 'Factor theorem', formula: '(x-a) is factor ⟺ p(a)=0', description: '(x-a) is a factor of p(x) if and only if p(a) = 0.' },

  // Pair of Linear Equations
  { id: 'm-le-1', subject: 'Mathematics', chapter: 'Pair of Linear Equations', name: 'Cramer\'s rule', formula: 'x = (ce-bf)/(ae-bd), y = (af-cd)/(ae-bd)', description: 'Solution of ax+by=c, dx+ey=f when ae-bd ≠ 0.' },
  { id: 'm-le-2', subject: 'Mathematics', chapter: 'Pair of Linear Equations', name: 'Consistency condition', formula: 'a₁/a₂ = b₁/b₂ = c₁/c₂', description: 'Infinite solutions if ratios equal; parallel (no solution) if a₁/a₂=b₁/b₂≠c₁/c₂.' },
  { id: 'm-le-3', subject: 'Mathematics', chapter: 'Pair of Linear Equations', name: 'Unique solution', formula: 'a₁/a₂ ≠ b₁/b₂', description: 'Unique solution exists when this ratio is unequal.' },

  // Quadratic Equations
  { id: 'm-qe-1', subject: 'Mathematics', chapter: 'Quadratic Equations', name: 'Quadratic formula', formula: 'x = [-b ± √(b²-4ac)] / 2a', description: 'Solution to ax² + bx + c = 0, a ≠ 0.' },
  { id: 'm-qe-2', subject: 'Mathematics', chapter: 'Quadratic Equations', name: 'Nature of roots', formula: 'D = b² - 4ac', description: 'D>0: two distinct real roots; D=0: two equal real roots; D<0: no real roots.' },
  { id: 'm-qe-3', subject: 'Mathematics', chapter: 'Quadratic Equations', name: 'Factored form', formula: 'ax² + bx + c = a(x-α)(x-β)', description: 'Where α, β are roots.' },

  // Arithmetic Progressions
  { id: 'm-ap-1', subject: 'Mathematics', chapter: 'Arithmetic Progressions', name: 'nth term', formula: 'aₙ = a + (n-1)d', description: 'nth term of an AP with first term a and common difference d.' },
  { id: 'm-ap-2', subject: 'Mathematics', chapter: 'Arithmetic Progressions', name: 'Sum of n terms', formula: 'Sₙ = n/2 [2a + (n-1)d]', description: 'Sum of first n terms of an AP.' },
  { id: 'm-ap-3', subject: 'Mathematics', chapter: 'Arithmetic Progressions', name: 'Sum (alt form)', formula: 'Sₙ = n/2 (a + l)', description: 'Sum when first term a and last term l are known.' },
  { id: 'm-ap-4', subject: 'Mathematics', chapter: 'Arithmetic Progressions', name: 'Common difference', formula: 'd = aₙ₊₁ - aₙ', description: 'Difference between consecutive terms.' },
  { id: 'm-ap-5', subject: 'Mathematics', chapter: 'Arithmetic Progressions', name: 'Mean of AP', formula: 'mean = (a+l)/2', description: 'Arithmetic mean of first and last term.' },

  // Triangles
  { id: 'm-tri-1', subject: 'Mathematics', chapter: 'Triangles', name: 'Pythagoras theorem', formula: 'a² + b² = c²', description: 'In a right triangle, square of hypotenuse = sum of squares of other two sides.' },
  { id: 'm-tri-2', subject: 'Mathematics', chapter: 'Triangles', name: 'Similarity (AAA)', formula: '∠A=∠P, ∠B=∠Q, ∠C=∠R', description: 'If corresponding angles are equal, triangles are similar.' },
  { id: 'm-tri-3', subject: 'Mathematics', chapter: 'Triangles', name: 'Area ratio', formula: 'ar(ABC)/ar(PQR) = (AB/PQ)²', description: 'Ratio of areas of similar triangles = square of ratio of corresponding sides.' },
  { id: 'm-tri-4', subject: 'Mathematics', chapter: 'Triangles', name: 'Basic proportionality', formula: 'AD/DB = AE/EC', description: 'Thales theorem: line parallel to one side divides other two sides proportionally.' },
  { id: 'm-tri-5', subject: 'Mathematics', chapter: 'Triangles', name: 'Pythagorean triple', formula: 'a² + b² = c²', description: 'Triples like (3,4,5), (5,12,13), (8,15,17).' },

  // Coordinate Geometry
  { id: 'm-cg-1', subject: 'Mathematics', chapter: 'Coordinate Geometry', name: 'Distance formula', formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]', description: 'Distance between two points (x₁,y₁) and (x₂,y₂).' },
  { id: 'm-cg-2', subject: 'Mathematics', chapter: 'Coordinate Geometry', name: 'Section formula', formula: 'P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))', description: 'Coordinates of point dividing line segment internally in ratio m:n.' },
  { id: 'm-cg-3', subject: 'Mathematics', chapter: 'Coordinate Geometry', name: 'Midpoint formula', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', description: 'Midpoint of segment joining (x₁,y₁) and (x₂,y₂).' },
  { id: 'm-cg-4', subject: 'Mathematics', chapter: 'Coordinate Geometry', name: 'Area of triangle', formula: 'A = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|', description: 'Area of triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃).' },

  // Trigonometry
  { id: 'm-trig-1', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'sin²θ + cos²θ', formula: 'sin²θ + cos²θ = 1', description: 'Fundamental trigonometric identity.' },
  { id: 'm-trig-2', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: '1 + tan²θ', formula: '1 + tan²θ = sec²θ', description: 'Pythagorean identity for tangent.' },
  { id: 'm-trig-3', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: '1 + cot²θ', formula: '1 + cot²θ = cosec²θ', description: 'Pythagorean identity for cotangent.' },
  { id: 'm-trig-4', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'sin θ', formula: 'sin θ = P/H', description: 'Perpendicular / Hypotenuse.' },
  { id: 'm-trig-5', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'cos θ', formula: 'cos θ = B/H', description: 'Base / Hypotenuse.' },
  { id: 'm-trig-6', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'tan θ', formula: 'tan θ = P/B = sin θ/cos θ', description: 'Perpendicular / Base.' },
  { id: 'm-trig-7', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'sin(90-θ)', formula: 'sin(90°-θ) = cos θ', description: 'Complementary angle identity.' },
  { id: 'm-trig-8', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'tan(90-θ)', formula: 'tan(90°-θ) = cot θ', description: 'Complementary angle identity.' },
  { id: 'm-trig-9', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', name: 'Standard values', formula: 'sin0=0, sin30=½, sin45=1/√2, sin60=√3/2, sin90=1', description: 'Standard sine values for 0°, 30°, 45°, 60°, 90°.' },

  // Applications of Trigonometry
  { id: 'm-atrig-1', subject: 'Mathematics', chapter: 'Applications of Trigonometry', name: 'Height (line of sight)', formula: 'h = d × tan θ', description: 'Height of object when distance d and angle of elevation θ known.' },
  { id: 'm-atrig-2', subject: 'Mathematics', chapter: 'Applications of Trigonometry', name: 'Distance', formula: 'd = h / tan θ', description: 'Distance to object of height h at angle of elevation θ.' },
  { id: 'm-atrig-3', subject: 'Mathematics', chapter: 'Applications of Trigonometry', name: 'Angle of elevation', formula: 'tan θ = h/d', description: 'Angle from horizontal to line of sight.' },

  // Circles
  { id: 'm-cir-1', subject: 'Mathematics', chapter: 'Circles', name: 'Circumference', formula: 'C = 2πr', description: 'Circumference of circle with radius r.' },
  { id: 'm-cir-2', subject: 'Mathematics', chapter: 'Circles', name: 'Area of circle', formula: 'A = πr²', description: 'Area of circle with radius r.' },
  { id: 'm-cir-3', subject: 'Mathematics', chapter: 'Circles', name: 'Length of arc', formula: 'l = (θ/360°) × 2πr', description: 'Length of arc with central angle θ.' },
  { id: 'm-cir-4', subject: 'Mathematics', chapter: 'Circles', name: 'Area of sector', formula: 'A = (θ/360°) × πr²', description: 'Area of sector with central angle θ.' },
  { id: 'm-cir-5', subject: 'Mathematics', chapter: 'Circles', name: 'Tangent property', formula: 'OP ⊥ tangent at P', description: 'Radius to point of tangency is perpendicular to the tangent.' },

  // Areas Related to Circles
  { id: 'm-arc-1', subject: 'Mathematics', chapter: 'Areas Related to Circles', name: 'Area of segment', formula: 'A = (θ/360°)πr² - ½r²sin θ', description: 'Area of minor segment of circle.' },
  { id: 'm-arc-2', subject: 'Mathematics', chapter: 'Areas Related to Circles', name: 'Area of sector (radians)', formula: 'A = ½r²θ', description: 'Area of sector when θ in radians.' },
  { id: 'm-arc-3', subject: 'Mathematics', chapter: 'Areas Related to Circles', name: 'Perimeter of sector', formula: 'P = 2r + l', description: 'Perimeter = 2 radii + arc length.' },

  // Surface Areas and Volumes
  { id: 'm-sav-1', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Sphere SA', formula: 'SA = 4πr²', description: 'Surface area of sphere.' },
  { id: 'm-sav-2', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Sphere V', formula: 'V = (4/3)πr³', description: 'Volume of sphere.' },
  { id: 'm-sav-3', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Cylinder SA', formula: 'SA = 2πr(r+h)', description: 'Total surface area of cylinder.' },
  { id: 'm-sav-4', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Cylinder V', formula: 'V = πr²h', description: 'Volume of cylinder.' },
  { id: 'm-sav-5', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Cone V', formula: 'V = (1/3)πr²h', description: 'Volume of cone.' },
  { id: 'm-sav-6', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Cone SA', formula: 'SA = πr(l+r)', description: 'Total surface area of cone, l = slant height.' },
  { id: 'm-sav-7', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Hemisphere SA', formula: 'SA = 3πr²', description: 'Total surface area of hemisphere.' },
  { id: 'm-sav-8', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Hemisphere V', formula: 'V = (2/3)πr³', description: 'Volume of hemisphere.' },
  { id: 'm-sav-9', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', name: 'Slant height of cone', formula: 'l = √(r²+h²)', description: 'Slant height from radius and height.' },

  // Statistics
  { id: 'm-stat-1', subject: 'Mathematics', chapter: 'Statistics', name: 'Mean (direct)', formula: 'x̄ = Σfᵢxᵢ / Σfᵢ', description: 'Mean of grouped data.' },
  { id: 'm-stat-2', subject: 'Mathematics', chapter: 'Statistics', name: 'Mean (assumed)', formula: 'x̄ = a + (Σfᵢdᵢ/Σfᵢ)', description: 'Assumed mean method, dᵢ = xᵢ - a.' },
  { id: 'm-stat-3', subject: 'Mathematics', chapter: 'Statistics', name: 'Mean (step dev)', formula: 'x̄ = a + (Σfᵢuᵢ/Σfᵢ)×h', description: 'Step-deviation method, uᵢ = (xᵢ-a)/h.' },
  { id: 'm-stat-4', subject: 'Mathematics', chapter: 'Statistics', name: 'Mode', formula: 'Mode = l + [(f₁-f₀)/(2f₁-f₀-f₂)]×h', description: 'l = lower limit of modal class, h = class size.' },
  { id: 'm-stat-5', subject: 'Mathematics', chapter: 'Statistics', name: 'Median', formula: 'Median = l + [(n/2-cf)/f]×h', description: 'l = lower limit of median class, cf = cumulative freq before.' },
  { id: 'm-stat-6', subject: 'Mathematics', chapter: 'Statistics', name: 'Empirical relation', formula: '3 Median = 2 Mean + Mode', description: 'Relation between mean, median, mode.' },

  // Probability
  { id: 'm-prob-1', subject: 'Mathematics', chapter: 'Probability', name: 'Probability', formula: 'P(E) = n(E)/n(S)', description: 'Probability = favorable outcomes / total outcomes.' },
  { id: 'm-prob-2', subject: 'Mathematics', chapter: 'Probability', name: 'Complement', formula: 'P(E) = 1 - P(Ē)', description: 'Probability of not E.' },
  { id: 'm-prob-3', subject: 'Mathematics', chapter: 'Probability', name: 'Sure event', formula: 'P(S) = 1', description: 'Probability of sample space.' },
  { id: 'm-prob-4', subject: 'Mathematics', chapter: 'Probability', name: 'Impossible event', formula: 'P(∅) = 0', description: 'Probability of impossible event.' },
  { id: 'm-prob-5', subject: 'Mathematics', chapter: 'Probability', name: 'Range', formula: '0 ≤ P(E) ≤ 1', description: 'Probability always between 0 and 1.' },

  // ===== PHYSICS =====
  // Electricity
  { id: 'p-elec-1', subject: 'Physics', chapter: 'Electricity', name: 'Ohm\'s law', formula: 'V = IR', description: 'Voltage = Current × Resistance.' },
  { id: 'p-elec-2', subject: 'Physics', chapter: 'Electricity', name: 'Resistance', formula: 'R = ρl/A', description: 'Resistance = resistivity × length / area.' },
  { id: 'p-elec-3', subject: 'Physics', chapter: 'Electricity', name: 'Series resistance', formula: 'Rₛ = R₁ + R₂ + R₃', description: 'Total resistance in series.' },
  { id: 'p-elec-4', subject: 'Physics', chapter: 'Electricity', name: 'Parallel resistance', formula: '1/Rₚ = 1/R₁ + 1/R₂ + 1/R₃', description: 'Total resistance in parallel.' },
  { id: 'p-elec-5', subject: 'Physics', chapter: 'Electricity', name: 'Electric power', formula: 'P = VI = I²R = V²/R', description: 'Power dissipated in a resistor.' },
  { id: 'p-elec-6', subject: 'Physics', chapter: 'Electricity', name: 'Electric energy', formula: 'E = VIt = Pt', description: 'Energy = power × time.' },
  { id: 'p-elec-7', subject: 'Physics', chapter: 'Electricity', name: 'Current', formula: 'I = Q/t', description: 'Current = charge / time.' },
  { id: 'p-elec-8', subject: 'Physics', chapter: 'Electricity', name: 'Heat (Joule)', formula: 'H = I²Rt', description: 'Heat produced by current.' },

  // Magnetic Effects
  { id: 'p-mag-1', subject: 'Physics', chapter: 'Magnetic Effects', name: 'Magnetic field (straight wire)', formula: 'B = μ₀I/(2πr)', description: 'Field at distance r from long straight wire.' },
  { id: 'p-mag-2', subject: 'Physics', chapter: 'Magnetic Effects', name: 'Magnetic field (loop center)', formula: 'B = μ₀I/(2R)', description: 'Field at center of circular loop radius R.' },
  { id: 'p-mag-3', subject: 'Physics', chapter: 'Magnetic Effects', name: 'Solenoid field', formula: 'B = μ₀nI', description: 'Field inside solenoid, n = turns per unit length.' },
  { id: 'p-mag-4', subject: 'Physics', chapter: 'Magnetic Effects', name: 'Force on wire', formula: 'F = BIL sin θ', description: 'Force on current-carrying wire in magnetic field.' },
  { id: 'p-mag-5', subject: 'Physics', chapter: 'Magnetic Effects', name: 'Fleming\'s left rule', formula: 'F = BIL', description: 'Thumb=Force, Forefinger=Field, Middle=Current.' },

  // Light Reflection and Refraction
  { id: 'p-light-1', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Mirror formula', formula: '1/v + 1/u = 1/f', description: 'Relation between object, image distance and focal length.' },
  { id: 'p-light-2', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Magnification (mirror)', formula: 'm = -v/u = hᵢ/hₒ', description: 'Magnification by mirror.' },
  { id: 'p-light-3', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Lens formula', formula: '1/v - 1/u = 1/f', description: 'Lens equation.' },
  { id: 'p-light-4', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Magnification (lens)', formula: 'm = v/u = hᵢ/hₒ', description: 'Magnification by lens.' },
  { id: 'p-light-5', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Snell\'s law', formula: 'n = sin i / sin r', description: 'Refractive index.' },
  { id: 'p-light-6', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Refractive index', formula: 'n = c/v', description: 'n = speed of light in vacuum / speed in medium.' },
  { id: 'p-light-7', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Power of lens', formula: 'P = 1/f (in meters)', description: 'Power in diopters, f in meters.' },
  { id: 'p-light-8', subject: 'Physics', chapter: 'Light Reflection and Refraction', name: 'Focal length (mirror)', formula: 'f = R/2', description: 'Focal length = radius of curvature / 2.' },

  // Human Eye and Colourful World
  { id: 'p-eye-1', subject: 'Physics', chapter: 'Human Eye and Colourful World', name: 'Power of accommodation', formula: 'f changes via ciliary muscles', description: 'Eye changes focal length to focus objects at different distances.' },
  { id: 'p-eye-2', subject: 'Physics', chapter: 'Human Eye and Colourful World', name: 'Defect correction (myopia)', formula: '1/f = 1/v - 1/u', description: 'Concave lens used to correct myopia.' },
  { id: 'p-eye-3', subject: 'Physics', chapter: 'Human Eye and Colourful World', name: 'Defect correction (hyperopia)', formula: 'Concave → Convex lens', description: 'Convex lens used to correct hypermetropia.' },
  { id: 'p-eye-4', subject: 'Physics', chapter: 'Human Eye and Colourful World', name: 'Dispersion', formula: 'n_violet > n_red', description: 'Violet bends more than red; white light splits into spectrum.' },
  { id: 'p-eye-5', subject: 'Physics', chapter: 'Human Eye and Colourful World', name: 'Scattering (Rayleigh)', formula: 'I ∝ 1/λ⁴', description: 'Scattering intensity inversely proportional to fourth power of wavelength.' },

  // ===== CHEMISTRY =====
  // Chemical Reactions
  { id: 'c-cr-1', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Balanced equation', formula: 'aA + bB → cC + dD', description: 'Number of atoms conserved on both sides.' },
  { id: 'c-cr-2', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Combination', formula: 'A + B → AB', description: 'Two or more reactants form one product.' },
  { id: 'c-cr-3', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Decomposition', formula: 'AB → A + B', description: 'One reactant breaks into two or more products.' },
  { id: 'c-cr-4', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Displacement', formula: 'A + BC → AC + B', description: 'More reactive element displaces less reactive.' },
  { id: 'c-cr-5', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Double displacement', formula: 'AB + CD → AD + CB', description: 'Exchange of ions between two compounds.' },
  { id: 'c-cr-6', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Oxidation', formula: 'A → Aⁿ⁺ + ne⁻', description: 'Loss of electrons / gain of oxygen.' },
  { id: 'c-cr-7', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Reduction', formula: 'Aⁿ⁺ + ne⁻ → A', description: 'Gain of electrons / loss of oxygen.' },
  { id: 'c-cr-8', subject: 'Chemistry', chapter: 'Chemical Reactions', name: 'Redox', formula: 'Oxidation + Reduction', description: 'Both processes occur simultaneously.' },

  // Acids Bases Salts
  { id: 'c-abs-1', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'Acid + Metal', formula: 'Acid + Metal → Salt + H₂↑', description: 'Acids react with metals to liberate hydrogen gas.' },
  { id: 'c-abs-2', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'Acid + Base', formula: 'Acid + Base → Salt + Water', description: 'Neutralization reaction.' },
  { id: 'c-abs-3', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'Acid + Carbonate', formula: 'Acid + CO₃²⁻ → Salt + H₂O + CO₂↑', description: 'Acids liberate CO₂ from carbonates.' },
  { id: 'c-abs-4', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'pH scale', formula: 'pH = -log[H⁺]', description: 'pH < 7 acidic, = 7 neutral, > 7 basic.' },
  { id: 'c-abs-5', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'Strong acid', formula: 'HCl, H₂SO₄, HNO₃', description: 'Completely ionize in water.' },
  { id: 'c-abs-6', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'Strong base', formula: 'NaOH, KOH', description: 'Completely ionize in water.' },
  { id: 'c-abs-7', subject: 'Chemistry', chapter: 'Acids Bases Salts', name: 'Salt hydrolysis', formula: 'Salt + Water → Acid + Base', description: 'Reverse of neutralization.' },

  // Metals and Non-Metals
  { id: 'c-mnm-1', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Metal + O₂', formula: 'Metal + O₂ → Metal oxide', description: 'Metals form basic oxides.' },
  { id: 'c-mnm-2', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Metal + Acid', formula: 'Metal + Acid → Salt + H₂↑', description: 'Reactive metals displace hydrogen from acids.' },
  { id: 'c-mnm-3', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Metal + Water', formula: 'Metal + H₂O → Metal oxide + H₂', description: 'Or Metal hydroxide + H₂ for very reactive metals.' },
  { id: 'c-mnm-4', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Reactivity series', formula: 'K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag > Au', description: 'From most to least reactive.' },
  { id: 'c-mnm-5', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Extraction (roasting)', formula: '2ZnS + 3O₂ → 2ZnO + 2SO₂', description: 'Heating ore in excess air.' },
  { id: 'c-mnm-6', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Extraction (calcination)', formula: 'ZnCO₃ → ZnO + CO₂', description: 'Heating ore in absence of air.' },
  { id: 'c-mnm-7', subject: 'Chemistry', chapter: 'Metals and Non-Metals', name: 'Electrolytic refining', formula: 'Impure → Pure (at cathode)', description: 'Impure metal anode, pure metal cathode.' },

  // Carbon and Compounds
  { id: 'c-carb-1', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Catenation', formula: 'C-C, C=C, C≡C', description: 'Carbon\'s ability to form chains and rings.' },
  { id: 'c-carb-2', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Alkane', formula: 'CₙH₂ₙ₊₂', description: 'Saturated hydrocarbons (single bonds).' },
  { id: 'c-carb-3', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Alkene', formula: 'CₙH₂ₙ', description: 'Unsaturated (one double bond).' },
  { id: 'c-carb-4', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Alkyne', formula: 'CₙH₂ₙ₋₂', description: 'Unsaturated (one triple bond).' },
  { id: 'c-carb-5', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Ethanol combustion', formula: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O', description: 'Burns with clean blue flame.' },
  { id: 'c-carb-6', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Esterification', formula: 'Acid + Alcohol → Ester + Water', description: 'Forms sweet-smelling esters.' },
  { id: 'c-carb-7', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Saponification', formula: 'Ester + NaOH → Soap + Glycerol', description: 'Base hydrolysis of ester.' },
  { id: 'c-carb-8', subject: 'Chemistry', chapter: 'Carbon and Compounds', name: 'Hydrogenation', formula: 'C=C + H₂ → C-C (Ni catalyst)', description: 'Addition of hydrogen to unsaturated hydrocarbon.' },
];

export const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry'] as const;
export const MATH_CHAPTERS = [
  'Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations',
  'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry',
  'Introduction to Trigonometry', 'Applications of Trigonometry', 'Circles',
  'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability',
];
export const PHYSICS_CHAPTERS = [
  'Electricity', 'Magnetic Effects', 'Light Reflection and Refraction', 'Human Eye and Colourful World',
];
export const CHEMISTRY_CHAPTERS = [
  'Chemical Reactions', 'Acids Bases Salts', 'Metals and Non-Metals', 'Carbon and Compounds',
];
