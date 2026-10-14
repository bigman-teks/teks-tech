export default function Page() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP, mail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (<><h1 className="mb-4 text-2xl font-bold">Support</h1><div className="card max-w-md space-y-3 text-sm">
    <p>Need help with an invitation or a payment? Reach us here and include your payment reference if it is about a payment.</p>
    {wa && <a className="btn-primary" href={`https://wa.me/${wa}`}>Chat on WhatsApp</a>}{mail && <p><a className="text-bright" href={`mailto:${mail}`}>{mail}</a></p>}
    {!wa && !mail && <p className="text-slate2">Support contacts have not been configured yet.</p>}</div></>);
}
