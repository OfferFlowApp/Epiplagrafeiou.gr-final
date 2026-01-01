import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The ONLY function used for slugging across the app.
 * Converts Greek to Latin, handles accents, and turns spaces/slashes into hyphens.
 */
export const createSlug = (text: string): string => {
  if (!text) return '';

  const greekMap: { [key: string]: string } = {
    'α': 'a', 'ά': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'έ': 'e',
    'ζ': 'z', 'η': 'i', 'ή': 'i', 'θ': 'th', 'ι': 'i', 'ί': 'i', 'ϊ': 'i', 'ΐ': 'i',
    'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'ό': 'o',
    'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'ύ': 'y', 'ϋ': 'y', 'ΰ': 'y',
    'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o', 'ώ': 'o',
    'Α': 'a', 'Ά': 'a', 'Β': 'b', 'Γ': 'g', 'Δ': 'd', 'Ε': 'e', 'Έ': 'e',
    'Ζ': 'z', 'Η': 'i', 'Ή': 'i', 'Θ': 'th', 'Ι': 'i', 'Ί': 'i', 'Ϊ': 'i',
    'Κ': 'k', 'Λ': 'l', 'Μ': 'm', 'Ν': 'n', 'Ξ': 'x', 'Ο': 'o', 'Ό': 'o',
    'Π': 'p', 'Ρ': 'r', 'Σ': 's', 'Τ': 't', 'Υ': 'y', 'Ύ': 'y', 'Ϋ': 'y',
    'Φ': 'f', 'Χ': 'ch', 'Ψ': 'ps', 'Ω': 'o', 'Ώ': 'o'
  };

  return text
    .split('')
    .map(char => greekMap[char] || char.toLowerCase())
    .join('')
    .replace(/ \/ /g, '-') // Handle " / " as a single hyphen
    .replace(/[/]/g, '-')  // Handle any remaining slashes
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Trim ends
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function normalizeCategory(cat?: string): string {
    if (!cat) return "Uncategorized";
    return cat
        .split('>')
        .map(c => c.trim())
        .filter(Boolean)
        .join(' > ');
}
