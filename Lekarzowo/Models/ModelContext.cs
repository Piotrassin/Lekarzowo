using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Lekarzowo.Models
{
    public partial class ModelContext : DbContext
    {
        public ModelContext()
        {
        }

        public ModelContext(DbContextOptions<ModelContext> options)
            : base(options)
        {
        }

        public virtual DbSet<City> City { get; set; }
        public virtual DbSet<Doctor> Doctor { get; set; }
        public virtual DbSet<Illness> Illness { get; set; }
        public virtual DbSet<Illnesshistory> Illnesshistory { get; set; }
        public virtual DbSet<Local> Local { get; set; }
        public virtual DbSet<Medicine> Medicine { get; set; }
        public virtual DbSet<Medicinehistory> Medicinehistory { get; set; }
        public virtual DbSet<Oldillnesshistory> Oldillnesshistory { get; set; }
        public virtual DbSet<Oldmedicinehistory> Oldmedicinehistory { get; set; }
        public virtual DbSet<Patient> Patient { get; set; }
        public virtual DbSet<Person> Person { get; set; }
        public virtual DbSet<Referral> Referral { get; set; }
        public virtual DbSet<Reservation> Reservation { get; set; }
        public virtual DbSet<Room> Room { get; set; }
        public virtual DbSet<Speciality> Speciality { get; set; }
        public virtual DbSet<Treatment> Treatment { get; set; }
        public virtual DbSet<Treatmentonvisit> Treatmentonvisit { get; set; }
        public virtual DbSet<Visit> Visit { get; set; }
        public virtual DbSet<Workinghours> Workinghours { get; set; }





        //widoki
        public virtual DbQuery<View_AddressData> View_AddressData { get; set; }




        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseOracle("Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db-oracle)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=BAZA.PJWSTK.EDU.PL)));Persist Security Info=True;User Id=S17437;Password=oracle12;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:DefaultSchema", "S17437");

            modelBuilder.Entity<City>(entity =>
            {
                entity.ToTable("CITY");

                entity.HasIndex(e => e.Id)
                    .HasName("CITY_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(63)");
            });

            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.ToTable("DOCTOR");

                entity.HasIndex(e => e.Id)
                    .HasName("DOCTOR_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.SpecialityId)
                    .HasColumnName("SPECIALITY_ID")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.Doctor)
                    .HasForeignKey<Doctor>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("LEKARZ_PERSON");

                entity.HasOne(d => d.Speciality)
                    .WithMany(p => p.Doctor)
                    .HasForeignKey(d => d.SpecialityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("DOCTOR_SPECIALITY");
            });

            modelBuilder.Entity<Illness>(entity =>
            {
                entity.ToTable("ILLNESS");

                entity.HasIndex(e => e.Id)
                    .HasName("ILLNESS_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(255)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(63)");
            });

            modelBuilder.Entity<Illnesshistory>(entity =>
            {
                entity.ToTable("ILLNESSHISTORY");

                entity.HasIndex(e => e.Id)
                    .HasName("ILLNESSHISTORY_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Curedate)
                    .HasColumnName("CUREDATE")
                    .HasColumnType("DATE");

                entity.Property(e => e.Description)
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(255)");

                entity.Property(e => e.IllnessId)
                    .HasColumnName("ILLNESS_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.PatientId)
                    .HasColumnName("PATIENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.VisitId)
                    .HasColumnName("VISIT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.Illness)
                    .WithMany(p => p.Illnesshistory)
                    .HasForeignKey(d => d.IllnessId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ILLNESSHISTORY_ILLNESS");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Illnesshistory)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ILLNESSHISTORY_PATIENT");

                entity.HasOne(d => d.Visit)
                    .WithMany(p => p.Illnesshistory)
                    .HasForeignKey(d => d.VisitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ILLNESSHISTORY_VISIT");
            });

            modelBuilder.Entity<Local>(entity =>
            {
                entity.ToTable("LOCAL");

                entity.HasIndex(e => e.Id)
                    .HasName("LOCAL_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Blocknumber)
                    .HasColumnName("BLOCKNUMBER")
                    .HasColumnType("VARCHAR2(15)");

                entity.Property(e => e.CityId)
                    .HasColumnName("CITY_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(127)");

                entity.Property(e => e.Postcode)
                    .IsRequired()
                    .HasColumnName("POSTCODE")
                    .HasColumnType("VARCHAR2(15)");

                entity.Property(e => e.Streetname)
                    .IsRequired()
                    .HasColumnName("STREETNAME")
                    .HasColumnType("VARCHAR2(127)");

                entity.Property(e => e.Streetnumber)
                    .HasColumnName("STREETNUMBER")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.City)
                    .WithMany(p => p.Local)
                    .HasForeignKey(d => d.CityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ADDRESS_CITY");
            });

            modelBuilder.Entity<Medicine>(entity =>
            {
                entity.ToTable("MEDICINE");

                entity.HasIndex(e => e.Id)
                    .HasName("MEDICINE_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(63)");
            });

            modelBuilder.Entity<Medicinehistory>(entity =>
            {
                entity.HasKey(e => new { e.Startdate, e.IllnesshistoryId, e.MedicineId })
                    .HasName("MEDICINEHISTORY_PK");

                entity.ToTable("MEDICINEHISTORY");

                entity.HasIndex(e => new { e.MedicineId, e.IllnesshistoryId, e.Startdate })
                    .HasName("MEDICINEHISTORY_PK")
                    .IsUnique();

                entity.Property(e => e.Startdate)
                    .HasColumnName("STARTDATE")
                    .HasColumnType("DATE");

                entity.Property(e => e.IllnesshistoryId)
                    .HasColumnName("ILLNESSHISTORY_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.MedicineId)
                    .HasColumnName("MEDICINE_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Description)
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(127)");

                entity.Property(e => e.Finishdate)
                    .HasColumnName("FINISHDATE")
                    .HasColumnType("DATE");

                entity.HasOne(d => d.Illnesshistory)
                    .WithMany(p => p.Medicinehistory)
                    .HasForeignKey(d => d.IllnesshistoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("MEDICINEHISTORY_ILLNESSHISTORY");

                entity.HasOne(d => d.Medicine)
                    .WithMany(p => p.Medicinehistory)
                    .HasForeignKey(d => d.MedicineId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("MEDICINEHISTORY_MEDICINE");
            });

            modelBuilder.Entity<Oldillnesshistory>(entity =>
            {
                entity.HasKey(e => new { e.Date, e.PatientId, e.IllnessId })
                    .HasName("OLDILLNESSHISTORY_PK");

                entity.ToTable("OLDILLNESSHISTORY");

                entity.HasIndex(e => new { e.IllnessId, e.PatientId, e.Date })
                    .HasName("OLDILLNESSHISTORY_PK")
                    .IsUnique();

                entity.Property(e => e.Date).HasColumnType("DATE");

                entity.Property(e => e.PatientId)
                    .HasColumnName("PATIENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.IllnessId)
                    .HasColumnName("ILLNESS_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Curedate)
                    .HasColumnName("CUREDATE")
                    .HasColumnType("DATE");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(255)");

                entity.HasOne(d => d.Illness)
                    .WithMany(p => p.Oldillnesshistory)
                    .HasForeignKey(d => d.IllnessId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TABLE_41_ILLNESS");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Oldillnesshistory)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TABLE_41_PATIENT");
            });

            modelBuilder.Entity<Oldmedicinehistory>(entity =>
            {
                entity.HasKey(e => new { e.Date, e.PatientId, e.MedicineId })
                    .HasName("OLDMEDICINEHISTORY_PK");

                entity.ToTable("OLDMEDICINEHISTORY");

                entity.HasIndex(e => new { e.MedicineId, e.PatientId, e.Date })
                    .HasName("OLDMEDICINEHISTORY_PK")
                    .IsUnique();

                entity.Property(e => e.Date).HasColumnType("DATE");

                entity.Property(e => e.PatientId)
                    .HasColumnName("PATIENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.MedicineId)
                    .HasColumnName("MEDICINE_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Description)
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(255)");

                entity.HasOne(d => d.Medicine)
                    .WithMany(p => p.Oldmedicinehistory)
                    .HasForeignKey(d => d.MedicineId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TABLE_40_MEDICINE");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Oldmedicinehistory)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TABLE_40_PATIENT");
            });

            modelBuilder.Entity<Patient>(entity =>
            {
                entity.ToTable("PATIENT");

                entity.HasIndex(e => e.Id)
                    .HasName("PATIENT_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.Patient)
                    .HasForeignKey<Patient>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("PATIENT_PERSON");
            });

            modelBuilder.Entity<Person>(entity =>
            {
                entity.ToTable("PERSON");

                entity.HasIndex(e => e.Id)
                    .HasName("PERSON_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Birthdate)
                    .HasColumnName("BIRTHDATE")
                    .HasColumnType("DATE");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("EMAIL")
                    .HasColumnType("VARCHAR2(63)");

                entity.Property(e => e.Gender)
                    .IsRequired()
                    .HasColumnName("GENDER")
                    .HasColumnType("CHAR(1)");

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasColumnName("LASTNAME")
                    .HasColumnType("VARCHAR2(63)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(63)");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("PASSWORD")
                    .HasColumnType("CHAR(256)");

                entity.Property(e => e.Pesel)
                    .HasColumnName("PESEL")
                    .HasColumnType("NUMBER(11)");
            });

            modelBuilder.Entity<Referral>(entity =>
            {
                entity.ToTable("REFERRAL");

                entity.HasIndex(e => e.Id)
                    .HasName("REFERRAL_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Dateofissue)
                    .HasColumnName("DATEOFISSUE")
                    .HasColumnType("DATE");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(255)");

                entity.Property(e => e.DoctorId)
                    .HasColumnName("DOCTOR_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.PatientId)
                    .HasColumnName("PATIENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.TreatmentId)
                    .HasColumnName("TREATMENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.Referral)
                    .HasForeignKey(d => d.DoctorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("REFERRAL_DOCTOR");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Referral)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("REFERRAL_PATIENT");

                entity.HasOne(d => d.Treatment)
                    .WithMany(p => p.Referral)
                    .HasForeignKey(d => d.TreatmentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("REFERRAL_TREATMENT");
            });

            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.ToTable("RESERVATION");

                entity.HasIndex(e => e.Id)
                    .HasName("RESERVATION_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Canceled)
                    .HasColumnName("CANCELED")
                    .HasColumnType("TIMESTAMP(6)");

                entity.Property(e => e.DoctorId)
                    .HasColumnName("DOCTOR_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Endtime)
                    .HasColumnName("ENDTIME")
                    .HasColumnType("TIMESTAMP(6)");

                entity.Property(e => e.PatientId)
                    .HasColumnName("PATIENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Starttime)
                    .HasColumnName("STARTTIME")
                    .HasColumnType("TIMESTAMP(6)");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.Reservation)
                    .HasForeignKey(d => d.DoctorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RESERVATION_DOCTOR");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Reservation)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RESERVATION_PATIENT");
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.ToTable("ROOM");

                entity.HasIndex(e => e.Id)
                    .HasName("ROOM_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.LocalId)
                    .HasColumnName("LOCAL_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Number).HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.Local)
                    .WithMany(p => p.Room)
                    .HasForeignKey(d => d.LocalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ROOM_LOCAL");
            });

            modelBuilder.Entity<Speciality>(entity =>
            {
                entity.ToTable("SPECIALITY");

                entity.HasIndex(e => e.Id)
                    .HasName("SPECIALITY_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(63)");

                entity.Property(e => e.Price)
                    .HasColumnName("PRICE")
                    .HasColumnType("NUMBER(38)");
            });

            modelBuilder.Entity<Treatment>(entity =>
            {
                entity.ToTable("TREATMENT");

                entity.HasIndex(e => e.Id)
                    .HasName("TREATMENT_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasColumnType("VARCHAR2(63)");

                entity.Property(e => e.Price)
                    .HasColumnName("PRICE")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Time)
                    .HasColumnName("TIME")
                    .HasColumnType("TIMESTAMP(6)");
            });

            modelBuilder.Entity<Treatmentonvisit>(entity =>
            {
                entity.HasKey(e => e.TreatmentId)
                    .HasName("TREATMENTONVISIT_PK");

                entity.ToTable("TREATMENTONVISIT");

                entity.HasIndex(e => e.TreatmentId)
                    .HasName("TREATMENTONVISIT_PK")
                    .IsUnique();

                entity.Property(e => e.TreatmentId)
                    .HasColumnName("TREATMENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Description)
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(255)");

                entity.Property(e => e.VisitId)
                    .HasColumnName("VISIT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.Treatment)
                    .WithOne(p => p.Treatmentonvisit)
                    .HasForeignKey<Treatmentonvisit>(d => d.TreatmentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TREAMENTONVISIT_TREATMENT");

                entity.HasOne(d => d.Visit)
                    .WithMany(p => p.Treatmentonvisit)
                    .HasForeignKey(d => d.VisitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TREATMENTONVISIT_VISIT");
            });

            modelBuilder.Entity<Visit>(entity =>
            {
                entity.HasKey(e => e.ReservationId)
                    .HasName("VISIT_PK");

                entity.ToTable("VISIT");

                entity.HasIndex(e => e.ReservationId)
                    .HasName("VISIT_PK")
                    .IsUnique();

                entity.Property(e => e.ReservationId)
                    .HasColumnName("RESERVATION_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Description)
                    .HasColumnName("DESCRIPTION")
                    .HasColumnType("VARCHAR2(127)");

                entity.Property(e => e.DoctorId)
                    .HasColumnName("DOCTOR_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.PatientId)
                    .HasColumnName("PATIENT_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.Price)
                    .HasColumnName("PRICE")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.RoomId)
                    .HasColumnName("ROOM_ID")
                    .HasColumnType("NUMBER(38)");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.Visit)
                    .HasForeignKey(d => d.DoctorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("VISIT_DOCTOR");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Visit)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("VISIT_PATIENT");

                entity.HasOne(d => d.Reservation)
                    .WithOne(p => p.Visit)
                    .HasForeignKey<Visit>(d => d.ReservationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("VISIT_RESERVATION");

                entity.HasOne(d => d.Room)
                    .WithMany(p => p.Visit)
                    .HasForeignKey(d => d.RoomId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("VISIT_ROOM");
            });

            modelBuilder.Entity<Workinghours>(entity =>
            {
                entity.ToTable("WORKINGHOURS");

                entity.HasIndex(e => e.Id)
                    .HasName("WORKINGHOURS_PK")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasColumnType("NUMBER(38)")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.DoctorId)
                    .HasColumnName("DOCTOR_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.From).HasColumnType("TIMESTAMP(6)");

                entity.Property(e => e.LocalId)
                    .HasColumnName("LOCAL_ID")
                    .HasColumnType("NUMBER(38)");

                entity.Property(e => e.To).HasColumnType("TIMESTAMP(6)");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.Workinghours)
                    .HasForeignKey(d => d.DoctorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("WORKHOURS_DOCTOR");

                entity.HasOne(d => d.Local)
                    .WithMany(p => p.Workinghours)
                    .HasForeignKey(d => d.LocalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("WORKINGHOURS_LOCAL");
            });






            //widoki
            modelBuilder.Query<View_AddressData>().ToView("VW_ADDRESS_DATA");




            //sekwencje





            modelBuilder.HasSequence("CITY_PK");

            modelBuilder.HasSequence("CITY_SEQ");

            modelBuilder.HasSequence("DEPT_SEQ");

            modelBuilder.HasSequence("ISEQ$$_1079246");

            modelBuilder.HasSequence("ISEQ$$_1079248");

            modelBuilder.HasSequence("ISEQ$$_1079253");

            modelBuilder.HasSequence("ISEQ$$_1079256");

            modelBuilder.HasSequence("ISEQ$$_1079259");

            modelBuilder.HasSequence("ISEQ$$_1079263");

            modelBuilder.HasSequence("ISEQ$$_1079268");

            modelBuilder.HasSequence("ISEQ$$_1079271");

            modelBuilder.HasSequence("ISEQ$$_1079274");

            modelBuilder.HasSequence("ISEQ$$_1079277");

            modelBuilder.HasSequence("ISEQ$$_1079288");

            modelBuilder.HasSequence("ISEQ$$_1079291");

            modelBuilder.HasSequence("ISEQ$$_1079294");

            modelBuilder.HasSequence("ISEQ$$_1079297");

            modelBuilder.HasSequence("ISEQ$$_1079300");

            modelBuilder.HasSequence("ISEQ$$_1079303");

            modelBuilder.HasSequence("ISEQ$$_1079310");

            modelBuilder.HasSequence("ISEQ$$_1079703");

            modelBuilder.HasSequence("ISEQ$$_1079708");

            modelBuilder.HasSequence("ISEQ$$_1079711");

            modelBuilder.HasSequence("ISEQ$$_1079714");

            modelBuilder.HasSequence("ISEQ$$_1079717");

            modelBuilder.HasSequence("ISEQ$$_1079728");

            modelBuilder.HasSequence("ISEQ$$_1079731");

            modelBuilder.HasSequence("ISEQ$$_1079734");

            modelBuilder.HasSequence("ISEQ$$_1079737");

            modelBuilder.HasSequence("ISEQ$$_1079740");

            modelBuilder.HasSequence("ISEQ$$_1079743");

            modelBuilder.HasSequence("ISEQ$$_1079750");

            modelBuilder.HasSequence("SEQ_ZWIAZEK");
        }
    }
}
