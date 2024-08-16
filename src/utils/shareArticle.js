export default function shareArticle(id, type) {
  navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_ARTISIDE_URL}/${type}/${id}`
  );
}
