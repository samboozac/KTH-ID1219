const Pool = require('pg').Pool;
const pool = new Pool({
	user : 'exituser',
	host : 'localhost',
	database : 'exitjs',
	password : 'kth123',
	port : 5432,
});


/*example code
const getPeople = (req, res) => {
	pool.query('select * from people', (err, result) => {
		if(err){
			throw err;
		}
		res.status(200).json(result.rows);
	});
}
*/

const get_directors = (callback) => {
	var request = 'SELECT first_name, last_name, mail FROM DIRECTOR_OF_STUDIES ORDER BY last_name';
	//console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_examiners = (director_mail, budget_year, callback) => {
	var request = 'SELECT first_name, last_name, mail, area, tutoring_hours, remaining_tutoring_hours FROM EXAMINER, EXAMINER_WORK_YEAR WHERE EXAMINER_WORK_YEAR.examiner_mail = EXAMINER.mail ';
	request += 'AND budget_year = ' + budget_year + ' AND EXAMINER.director_mail = \'' + director_mail + '\' ORDER BY last_name';
	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_all_examiners = (director_mail, callback) => {
	var request = 'SELECT first_name, last_name, mail FROM EXAMINER WHERE director_mail = \'' + director_mail + '\' ORDER BY last_name';
	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_all_budget_years = (director_mail, callback) => {
	var request = 'SELECT budget_year FROM BUDGET_YEAR WHERE director_mail = \'' + director_mail + '\'';
	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_available_examiners = (callback) => {
	var year = new Date().getFullYear();
	var request = 'SELECT first_name, last_name, mail, area FROM EXAMINER, EXAMINER_WORK_YEAR WHERE EXAMINER_WORK_YEAR.examiner_mail = EXAMINER.mail ';
	request += 'AND budget_year = ' + year + ' AND remaining_tutoring_hours > 0 ORDER BY last_name';
	//console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_degree_projects = (examiner_mail, callback) => {
	var request = 'SELECT id, description, credits, start_date::varchar, stop_date::varchar, number_of_students, out_of_date FROM DEGREE_PROJECT ';
	request += 'WHERE examiner_mail = \'' + examiner_mail + '\' AND in_progress = TRUE ORDER BY id';
	//console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_degree_project_desc = (id, callback) => {
	var request = 'SELECT description FROM DEGREE_PROJECT WHERE DEGREE_PROJECT.id = ' + id;
	//console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_degree_project_students = (id, callback) => {
	var request = 'SELECT id, first_name, last_name, kth_mail, personal_number, alternative_mail, project_id, program ';
	request += 'FROM DEGREE_PROJECT, STUDENT WHERE DEGREE_PROJECT.id = ' + id + ' AND STUDENT.project_id = ' + id;
	//console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_degree_project_company = (id, callback) => {
	var request = 'SELECT name, address, phone_number, tutor FROM COMPANY, DEGREE_PROJECT WHERE DEGREE_PROJECT.id = ';
	request += id + ' AND DEGREE_PROJECT.id = COMPANY.project_id'
	//console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}



const update_date_project = (id) => {
	var request = 'UPDATE DEGREE_PROJECT SET out_of_date = TRUE WHERE DEGREE_PROJECT.id = ' + id;
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log(result);
	})
}

//SELECT budget_year, master_hours, bachelor_hours, factor_two, factor_three, factor_four, factor_five, factor_six, factor_seven, factor_eight, factor_nine, factor_ten
//FROM BUDGET_YEAR WHERE director_mail = 'test_dir@kth.se' ORDER BY budget_year;

const get_budget_years = (director_mail, callback) => {
	var request = 'SELECT budget_year, master_hours, bachelor_hours, factor_two, factor_three, factor_four, factor_five, ';
	request += 'factor_six, factor_seven, factor_eight, factor_nine, factor_ten FROM BUDGET_YEAR WHERE director_mail = \'';
	request += director_mail + '\' ORDER BY budget_year DESC';

	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_tutoring_hours = (examiner_mail, callback) => {
	var year = new Date().getFullYear();
	var request = 'SELECT tutoring_hours, remaining_tutoring_hours FROM EXAMINER_WORK_YEAR WHERE examiner_mail = \'';
	request += examiner_mail + '\' AND budget_year = ' + year;
	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_examiner_area = (examiner_mail, callback) => {
	var request = 'SELECT area FROM EXAMINER WHERE mail = \'' + examiner_mail + '\'';
	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		callback(result);
	})
}

const get_budget_year = (examiner_mail, callback) => {
	var request = 'SELECT director_mail FROM EXAMINER WHERE mail = \'' + examiner_mail + '\'';
	console.log(request);
	pool.query(request, (err, result) => {
		if(err){
			throw err;
		}
		console.log('rows: ' + result.rows + '\tcommand: ' + result.command + '\trowCount: ' + result.rowCount);
		var director_mail = result.rows[0].director_mail;
		var year = new Date().getFullYear();

		var request2 = 'SELECT budget_year, master_hours, bachelor_hours, factor_two, factor_three, factor_four, ';
		request2 += 'factor_five, factor_six, factor_seven, factor_eight, factor_nine, factor_ten FROM BUDGET_YEAR, EXAMINER ';
		request2 += 'WHERE BUDGET_YEAR.director_mail = \'' + director_mail + '\' AND EXAMINER.director_mail = \'' + director_mail;
		request2 += '\' AND budget_year = ' + year;
		pool.query(request2, (err, info) => {
			if(err){
				throw err;
			}
			callback(info);
		})
	})
}

const update_area = (examiner_mail, area, callback) => {
	var request = 'UPDATE EXAMINER set area = \'' + area + '\' WHERE mail = \'' + examiner_mail + '\'';
	console.log(request);
	pool.query(request, (err, result) => {
			if(err){
				callback(false);
			} else {
				callback(true);
			}
	});
}

const fs = require('fs');
var header = fs.readFileSync('views/header.html');
var footer = fs.readFileSync('views/footer.html');
var success = fs.readFileSync('views/success.html');
const main_menu = require('./main_menu');


const add_director = (req, res, mail, first_name, last_name) => {
	var post = 'INSERT INTO DIRECTOR_OF_STUDIES VALUES (\'' + mail + '\', \'' + first_name + '\', \'' + last_name + '\')';
	pool.query(post, (err, result) => {
		if(err){
			res.send("An error occured when attempting to add to the database");
			return;
		}
		console.log(result);

		var menu = main_menu.create_main_menu(req);
		res.send(header + menu + success + footer);
	});
}

const add_budget_year = (req, res, mail, budget_year) => {
	var post = "INSERT INTO BUDGET_YEAR VALUES ('" + mail + "', " + budget_year.budget_year + ", " + budget_year.master_hours + ", ";
	post += budget_year.bachelor_hours + ", " + budget_year.fact_2 + ", " + budget_year.fact_3 + ", " + budget_year.fact_4 + ", ";
	post += budget_year.fact_5 + ", " + budget_year.fact_6 + ", " + budget_year.fact_7 + ", " + budget_year.fact_8 + ", " + budget_year.fact_9 + ", ";
	post += budget_year.fact_10 + ")";

	pool.query(post, (err, result) => {
		if(err){
			res.send("An error occurred when attempting to add to the database");
			return;
		}
		console.log(result);

		var menu = main_menu.create_main_menu(req);
		res.send(header + menu + success + footer);
	});
}

const add_examiner = (req, res, director_mail, mail, first_name, last_name) => {
	var post = 'INSERT INTO EXAMINER VALUES (\'' + mail + '\', \'' + first_name + '\', \'' + last_name + '\', \'\', \'' + director_mail + '\')';
	pool.query(post, (err, result) => {
		if(err){
			res.send("An error occurred when attempting to add to the database");
			return;
		}
		console.log(result);

		var menu = main_menu.create_main_menu(req);
		res.send(header + menu + success + footer);
	});
}

const add_degree_project = (req, res, mail, project_info) => {
	var request = "select id from degree_project ORDER BY id DESC";
	pool.query(request, (err, result) => {
		if(err){
			res.send("An error occurred when attempting to add to the database");
			return;
		}
		var serial = 1;
		if(result.rowCount != 0){
			serial = result.rows[0].id + 1;
		}
		var credits;
		if(project_info.credits == 'bachelor'){
			credits = 15;
		} else {
			credits = 30;
		}
		var year = new Date().getFullYear();
		update_remaining_hours(mail, credits, year, project_info.number_of_students);

		var post = "INSERT INTO DEGREE_PROJECT VALUES (" + serial + ", '" + mail + "', " + project_info.number_of_students + ", '";
		post += project_info.description + "', " + credits + ", '" + project_info.start_date + "', '" + project_info.stop_date + "', ";
		post += "TRUE, FALSE, TRUE)";

		console.log(post);

		pool.query(post, (err, result) => {
			if(err){
				res.send("An error occured when attempting to add to the database");
				return;
			}
			console.log(result);

			//cant loop through variable names... why dear god 10?:
			if(project_info.number_of_students >= 1){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_0 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_0 + "', '" + project_info.last_name_0 + "', '" + project_info.program_0 + "', '" + project_info.kth_mail_0 + "', '";
				post2 += project_info.alternative_mail_0 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=2){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_1 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_1 + "', '" + project_info.last_name_1 + "', '" + project_info.program_1 + "', '" + project_info.kth_mail_1 + "', '";
				post2 += project_info.alternative_mail_1 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=3){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_2 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_2 + "', '" + project_info.last_name_2 + "', '" + project_info.program_2 + "', '" + project_info.kth_mail_2 + "', '";
				post2 += project_info.alternative_mail_2 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=4){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_3 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_3 + "', '" + project_info.last_name_3 + "', '" + project_info.program_3 + "', '" + project_info.kth_mail_3 + "', '";
				post2 += project_info.alternative_mail_3 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=5){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_4 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_4 + "', '" + project_info.last_name_4 + "', '" + project_info.program_4 + "', '" + project_info.kth_mail_4 + "', '";
				post2 += project_info.alternative_mail_4 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=6){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_5 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_5 + "', '" + project_info.last_name_5 + "', '" + project_info.program_5 + "', '" + project_info.kth_mail_5 + "', '";
				post2 += project_info.alternative_mail_5 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=7){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_6 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_6 + "', '" + project_info.last_name_6 + "', '" + project_info.program_6 + "', '" + project_info.kth_mail_6 + "', '";
				post2 += project_info.alternative_mail_6 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=8){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_7 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_7 + "', '" + project_info.last_name_7 + "', '" + project_info.program_7 + "', '" + project_info.kth_mail_7 + "', '";
				post2 += project_info.alternative_mail_7 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=9){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_8 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_8 + "', '" + project_info.last_name_8 + "', '" + project_info.program_8 + "', '" + project_info.kth_mail_8 + "', '";
				post2 += project_info.alternative_mail_8 + "')";
				add_student(post2);
			}
			if(project_info.number_of_students >=10){
				var post2 = "INSERT INTO STUDENT VALUES ('" + project_info.personal_number_9 + "', " + serial + ", '" + mail + "', '";
				post2 += project_info.first_name_9 + "', '" + project_info.last_name_9 + "', '" + project_info.program_9 + "', '" + project_info.kth_mail_9 + "', '";
				post2 += project_info.alternative_mail_9 + "')";
				add_student(post2);
			}

			if(project_info.place == 'company'){
				add_company(serial, mail, project_info.company, project_info.address, project_info.telephone, project_info.tutor);
			}

			var menu = main_menu.create_main_menu(req);
			res.send(header + menu + success + footer);
		});
	});
}

const add_student = (post) => {
	pool.query(post, (err, result) => {
		if(err){
			throw err;
			return;
		}
		console.log(result);
	});
}

const add_company = (id, mail, comp, addr, tele, tutor) => {
	var post = "INSERT INTO COMPANY VALUES (" + id + ", '" + mail + "', '" + comp + "', '" + addr + "', '" + tele + "', '" + tutor + "')";
	pool.query(post, (err, result) => {
		if(err){
			throw err;
			return;
		}
		console.log(result);
	});
}

const update_remaining_hours = (examiner_mail, credits, year, num_students) => {
	var request = "SELECT remaining_tutoring_hours FROM EXAMINER_WORK_YEAR WHERE budget_year = " + year + " AND examiner_mail = '" + examiner_mail + "'";
	pool.query(request, (err, result) => {
		if(err){
			throw err;
			return;
		}
		var remaining_hours = result.rows[0].remaining_tutoring_hours;

		var request2 = "SELECT director_mail FROM EXAMINER WHERE mail = '" + examiner_mail + "'";
		pool.query(request2, (err2, result2) => {
			if(err2){
				throw err2;
				return;
			}
			var director_mail = result2.rows[0].director_mail;

			var which_factor = "";
			if(num_students == 2){
				which_factor = ", factor_two";
			} else if(num_students == 3){
				which_factor = ", factor_three";
			} else if(num_students == 4){
				which_factor = ", factor_four";
			} else if(num_students == 5){
				which_factor = ", factor_five";
			} else if(num_students == 6){
				which_factor = ", factor_six";
			} else if(num_students == 7){
				which_factor = ", factor_seven";
			} else if(num_students == 8){
				which_factor = ", factor_eight";
			} else if(num_students == 9){
				which_factor = ", factor_nine";
			} else if(num_students == 10){
				which_factor = ", factor_ten";
			}
			var bachelor_master = "";
			if(credits == 15){
				bachelor_master = "bachelor_hours";
			} else {
				bachelor_master = "master_hours"	;
			}

			var request3 = "SELECT " + bachelor_master + which_factor + " FROM BUDGET_YEAR WHERE director_mail = '" + director_mail + "' AND budget_year = " + year;
			pool.query(request3, (err3, result3) => {
				if(err3){
					throw err3;
					return;
				}
				var minus;
				if(credits = 15) {
					minus = result3.rows[0].bachelor_hours;
				} else {
					minus = result3.rows[0].master_hours;
				}

				if(num_students == 2){
					minus = minus * result3.rows[0].factor_two;
				} else if(num_students == 3){
					minus = minus * result3.rows[0].factor_three;
				} else if(num_students == 4){
					minus = minus * result3.rows[0].factor_four;
				} else if(num_students == 5){
					minus = minus * result3.rows[0].factor_five;
				} else if(num_students == 6){
					minus = minus * result3.rows[0].factor_six;
				} else if(num_students == 7){
					minus = minus * result3.rows[0].factor_seven;
				} else if(num_students == 8){
					minus = minus * result3.rows[0].factor_eight;
				} else if(num_students == 9){
					minus = minus * result3.rows[0].factor_nine;
				} else if(num_students == 10){
					minus = minus * result3.rows[0].factor_ten;
				}

				remaining_hours = remaining_hours - minus;

				var post = "UPDATE EXAMINER_WORK_YEAR SET remaining_tutoring_hours = " + remaining_hours + " WHERE examiner_mail = '" + examiner_mail + "' AND budget_year = " + year;
				pool.query(post, (err4, result4) => {
					if(err4){
						throw err4;
						return;
					}
					console.log("updated remaining tutoring hours");
				});
			});
		});
	});
}

const specify_tutoring_hours = (req, res, director_mail, post_info) => {
	var post = "INSERT INTO EXAMINER_WORK_YEAR VALUES (" + post_info.year + ", '" + director_mail + "', '" + post_info.mail + "', ";
	post += post_info.hours + ", " + post_info.hours + ")";
	pool.query(post, (err, result) => {
		if(err){
			res.send("An error occurred when attempting to add to the database");
			return;
		}
		console.log(result);

		var menu = main_menu.create_main_menu(req);
		res.send(header + menu + success + footer);
	});
}

const mark_as_finished = (req, res, id) => {
	var post = "UPDATE DEGREE_PROJECT SET in_progress = FALSE WHERE id = " + id;
	pool.query(post, (err, result) => {
		if(err){
			res.send("An error occurred when attempting to update the database");
			return;
		}
		console.log(result);

		var menu = main_menu.create_main_menu(req);
		res.send("<html>" + success + "</html");
	});
}

module.exports = {
	get_directors,
	add_director,

	get_examiners,
	get_all_examiners,
	get_available_examiners,
	add_examiner,
	update_area,
	specify_tutoring_hours,
	get_tutoring_hours,
	get_examiner_area,
	get_budget_year,
	get_budget_years,
	get_all_budget_years,
	add_budget_year,

	get_degree_projects,
	get_degree_project_desc,
	get_degree_project_students,
	get_degree_project_company,
	add_degree_project,
	update_date_project,
	mark_as_finished
};
