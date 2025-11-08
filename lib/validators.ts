import { z } from "zod";

export const registerSchema = z.object({
  ad: z.string().min(2, "Ad en az 2 karakter olmalı"),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  sifre: z.string().min(8, "Şifre en az 8 karakter olmalı"),
  rol: z.enum(["admin", "sanatci", "label"]),
  labelAdi: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  sifre: z.string().min(1, "Şifre zorunludur")
});

export const trackSchema = z.object({
  isim: z.string().min(2),
  sanatciAdi: z.string().min(2),
  labelAdi: z.string().optional(),
  tur: z.string().min(2),
  cikisTarihi: z.string().min(1),
  isrc: z.string().min(5),
  telifSahibi: z.string().min(2)
});

export const trackStatusSchema = z.object({
  durum: z.enum(["ONAYLANDI", "REDDEDILDI"]),
  retSebebi: z.string().optional().refine((val) => !val || val.length >= 10, {
    message: "Ret sebebi en az 10 karakter olmalı"
  })
});

export const announcementSchema = z.object({
  baslik: z.string().min(3),
  icerik: z.string().min(10),
  hedefRol: z.enum(["TUMU", "SANATCI", "LABEL"])
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  yeniSifre: z.string().min(8)
});
