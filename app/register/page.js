import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import RegisterForm from "@/components/RegisterForm";

export const metadata = { title: "Register", description: "Register for free counseling. A trainee counselor will reach out to you." };

export default function Register() {
  return (
    <>
      <PageHero crumb="Register" title="Register for counseling">
        Fill in this short form. A trainee counselor will reach out to you to arrange your first session at our Counseling Lab.
      </PageHero>
      <section>
        <div className="wrap form-wrap">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
