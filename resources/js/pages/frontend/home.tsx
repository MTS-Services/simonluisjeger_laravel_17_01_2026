import FrontendLayout from "@/layouts/frontend-layout";
import { Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { login, register } from "@/routes";
import MainSvg from "@/components/main-svg";

export default function Home({
  canRegister = true,
}: {
  canRegister?: boolean;
}) {
  const { auth } = usePage<SharedData>().props;
  const dashboardRoute = auth.user?.is_admin ? route('admin.dashboard') : route('user.dashboard');

  return (
    <FrontendLayout>
      <MainSvg />
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex items-center justify-center order-1 lg:order-1">
        </div>

        <div className="order-2 lg:order-2">
          <div className="border-2 border-gray-300 rounded-lg min-h-[400px] lg:min-h-[600px] w-full"></div>
        </div>
      </div> */}
    </FrontendLayout>
  );
}
