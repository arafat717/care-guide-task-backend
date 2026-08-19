/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { envVars } from "../config/env";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      return;
    }

    const hashedPassword = bcrypt.hashSync(envVars.SUPER_ADMIN_PASSWORD!, 12);
    const admin = await User.create({
      name: "Mr.Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });

    await User.create(admin);
  } catch (error) {
    console.error("Error seeding super admin user:", error);
  }
};
