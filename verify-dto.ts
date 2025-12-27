import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { GetScheduleDoctorDto } from "./src/modules/admin/dto/get-schedule-doctor.dto";
import { GetDoctorsQueryDto } from "./src/modules/admin/dto/get-doctors.dto";
import "reflect-metadata";

async function run() {
    console.log("Verifying DTO Validation...");

    // Case 1: Valid - Just Skip+Take
    const dto1 = plainToInstance(GetScheduleDoctorDto, { skip: 0, take: 10 });
    const err1 = await validate(dto1);
    console.log("Case 1 (Valid Skip+Take):", err1.length === 0 ? "PASS" : "FAIL");
    if (err1.length > 0) console.log(JSON.stringify(err1, null, 2));

    // Case 2: Invalid - Take without Skip
    const dto2 = plainToInstance(GetScheduleDoctorDto, { take: 10 });
    const err2 = await validate(dto2);
    console.log("Case 2 (Invalid Take only):", err2.length > 0 ? "PASS" : "FAIL");
    if (err2.length === 0) console.log("Expected error but got none");

    // Case 3: Invalid - Search and Sort
    const dto3 = plainToInstance(GetScheduleDoctorDto, { search_by_doctor_id: "123", sort_by_start_time: "asc" });
    const err3 = await validate(dto3);
    console.log("Case 3 (Invalid Search+Sort):", err3.length > 0 ? "PASS" : "FAIL");
    if (err3.length === 0) console.log("Expected error but got none");

    // Case 4: Valid - Search Only
    const dto4 = plainToInstance(GetScheduleDoctorDto, { search_by_doctor_id: "123" });
    const err4 = await validate(dto4);
    console.log("Case 4 (Valid Search):", err4.length === 0 ? "PASS" : "FAIL");
    if (err4.length > 0) console.log(JSON.stringify(err4, null, 2));

    console.log("\nVerifying GetDoctorsQueryDto...");

    // Case 5: Valid - Search By Name
    const docDto1 = plainToInstance(GetDoctorsQueryDto, { search_by_name: "John" });
    const docErr1 = await validate(docDto1);
    console.log("Case 5 (Valid Search Name):", docErr1.length === 0 ? "PASS" : "FAIL");
    if (docErr1.length > 0) console.log(JSON.stringify(docErr1, null, 2));

    // Case 6: Invalid - Search By Name AND Id
    const docDto2 = plainToInstance(GetDoctorsQueryDto, { search_by_name: "John", search_by_id: "123" });
    const docErr2 = await validate(docDto2);
    console.log("Case 6 (Invalid Double Search):", docErr2.length > 0 ? "PASS" : "FAIL");
    if (docErr2.length === 0) console.log("Expected error but got none");
}

run();
